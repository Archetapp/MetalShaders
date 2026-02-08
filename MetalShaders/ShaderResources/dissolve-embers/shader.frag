#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float emberHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float emberNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = emberHash(i);
    float b = emberHash(i + vec2(1.0, 0.0));
    float c = emberHash(i + vec2(0.0, 1.0));
    float d = emberHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float emberFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
        v += a * emberNoise(p);
        p = p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

float emberParticle(vec2 uv, vec2 pos, float size) {
    float d = length(uv - pos);
    return smoothstep(size, size * 0.1, d);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    float cycleTime = 6.0;
    float t = mod(iTime, cycleTime);
    float progress = t / cycleTime;

    vec2 burnCenter = vec2(0.5 * aspect + 0.2 * cos(iTime * 0.3) * aspect,
                           0.5 + 0.2 * sin(iTime * 0.4));

    float distFromCenter = length(uvAspect - burnCenter);

    float noiseVal = emberFbm(uv * 5.0);
    float dissolveThreshold = progress * 2.0 - 0.3;
    float burnValue = distFromCenter * 0.8 + noiseVal * 0.4;
    float dissolved = smoothstep(dissolveThreshold - 0.05, dissolveThreshold + 0.05, burnValue);

    float edgeWidth = 0.08;
    float edge = smoothstep(dissolveThreshold - edgeWidth, dissolveThreshold, burnValue) *
                 (1.0 - smoothstep(dissolveThreshold, dissolveThreshold + edgeWidth * 0.5, burnValue));

    vec3 contentColor;
    float checker = step(0.5, fract(uv.x * 8.0)) * step(0.5, fract(uv.y * 8.0)) +
                    (1.0 - step(0.5, fract(uv.x * 8.0))) * (1.0 - step(0.5, fract(uv.y * 8.0)));
    vec3 pattern1 = mix(vec3(0.2, 0.3, 0.6), vec3(0.4, 0.5, 0.8), checker);

    float gradient = length(uv - 0.5) * 1.4;
    vec3 pattern2 = mix(vec3(0.3, 0.6, 0.4), vec3(0.1, 0.2, 0.3), gradient);
    contentColor = mix(pattern1, pattern2, 0.5);

    vec3 edgeColor1 = vec3(1.0, 0.8, 0.2);
    vec3 edgeColor2 = vec3(1.0, 0.3, 0.05);
    vec3 edgeColor3 = vec3(0.3, 0.05, 0.0);
    float edgeGradient = smoothstep(dissolveThreshold - edgeWidth, dissolveThreshold, burnValue);
    vec3 glowColor = mix(edgeColor1, edgeColor2, edgeGradient);
    glowColor = mix(glowColor, edgeColor3, pow(edgeGradient, 2.0));

    float glowPulse = 0.8 + 0.2 * sin(iTime * 8.0 + noiseVal * 10.0);
    glowColor *= glowPulse;

    vec3 col = contentColor * dissolved;
    col += glowColor * edge * 3.0;

    float outerGlow = smoothstep(dissolveThreshold + edgeWidth * 2.0, dissolveThreshold, burnValue) *
                      (1.0 - dissolved);
    col += vec3(1.0, 0.4, 0.1) * outerGlow * 0.5;

    for (int i = 0; i < 30; i++) {
        float id = float(i);
        float birthPhase = emberHash(vec2(id, 0.0));
        float particleTime = fract(iTime * 0.3 + birthPhase);

        vec2 birthPos = vec2(
            emberHash(vec2(id * 1.3, 7.0)) * aspect,
            emberHash(vec2(id * 2.7, 13.0))
        );

        float birthDist = length(birthPos - burnCenter);
        if (birthDist > dissolveThreshold + 0.3 || birthDist < dissolveThreshold - 0.3) continue;

        vec2 emberPos = birthPos;
        emberPos.y += particleTime * (0.3 + emberHash(vec2(id, 3.0)) * 0.3);
        emberPos.x += sin(particleTime * 6.28 + id) * 0.05;

        float size = 0.004 + emberHash(vec2(id, 5.0)) * 0.006;
        float fade = (1.0 - particleTime) * smoothstep(0.0, 0.1, particleTime);

        float particle = emberParticle(uvAspect, emberPos, size);

        vec3 emberColor = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.3, 0.05), particleTime);
        col += emberColor * particle * fade * 2.0;
    }

    vec3 bgColor = vec3(0.02, 0.02, 0.03);
    col = mix(bgColor, col, max(dissolved, max(edge, outerGlow)));
    col += bgColor * (1.0 - dissolved) * (1.0 - edge) * (1.0 - outerGlow);

    fragColor = vec4(col, 1.0);
}
