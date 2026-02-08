#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float fgwHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float fgwNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(fgwHash(i), fgwHash(i + vec2(1, 0)), f.x),
               mix(fgwHash(i + vec2(0, 1)), fgwHash(i + vec2(1, 1)), f.x), f.y);
}

float fgwFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * fgwNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
    vec2 wipePos = hasInput ? mouseCentered : vec2(sin(iTime * 0.4) * 0.4, cos(iTime * 0.3) * 0.3);
    float wipeDist = length(centered - wipePos);

    float wipeRadius = 0.3 + 0.1 * sin(iTime * 0.5);
    float clearMask = smoothstep(wipeRadius, wipeRadius - 0.15, wipeDist);

    float regrow = 0.0;
    for (int i = 0; i < 4; i++) {
        float t = iTime * 0.4 + float(i) * 2.0;
        float phase = floor(t / 4.0);
        float localT = fract(t / 4.0) * 4.0;
        vec2 oldWipe = vec2(sin(phase * 1.3) * 0.4, cos(phase * 0.9) * 0.3);
        float oldDist = length(centered - oldWipe);
        float oldClear = smoothstep(0.3, 0.15, oldDist);
        float regrowth = smoothstep(0.0, 3.0, localT);
        regrow += oldClear * regrowth;
    }
    clearMask = max(clearMask - regrow * 0.3, 0.0);

    vec3 sharpContent = vec3(0.0);
    float checker = step(0.5, fract(centered.x * 3.0)) * step(0.5, fract(centered.y * 3.0)) +
                    step(0.5, fract(centered.x * 3.0 + 0.5)) * step(0.5, fract(centered.y * 3.0 + 0.5));
    sharpContent = mix(vec3(0.2, 0.4, 0.6), vec3(0.6, 0.3, 0.2), checker);
    float circle = smoothstep(0.32, 0.3, length(centered));
    sharpContent = mix(sharpContent, vec3(0.8, 0.6, 0.2), circle);

    float frostNoise = fgwFbm(uv * 8.0);
    float frostDetail = fgwFbm(uv * 20.0) * 0.5 + fgwFbm(uv * 40.0) * 0.25;
    vec2 frostOffset = vec2(frostNoise, frostDetail) * 0.03;
    vec3 blurredContent = vec3(0.0);
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 0.785;
        vec2 offset = vec2(cos(angle), sin(angle)) * 0.02 * (1.0 + frostNoise);
        vec2 sampleUv = centered + offset + frostOffset;
        float c = step(0.5, fract(sampleUv.x * 3.0)) * step(0.5, fract(sampleUv.y * 3.0)) +
                  step(0.5, fract(sampleUv.x * 3.0 + 0.5)) * step(0.5, fract(sampleUv.y * 3.0 + 0.5));
        blurredContent += mix(vec3(0.2, 0.4, 0.6), vec3(0.6, 0.3, 0.2), c);
    }
    blurredContent /= 8.0;

    vec3 frostColor = blurredContent * 0.5 + vec3(0.7, 0.75, 0.8) * 0.5;
    frostColor += frostDetail * 0.15;
    float droplets = pow(fgwNoise(uv * 50.0), 8.0) * 0.3;
    frostColor += droplets;

    vec3 col = mix(frostColor, sharpContent, clearMask);

    float edgeGlow = smoothstep(wipeRadius - 0.15, wipeRadius - 0.05, wipeDist) *
                     smoothstep(wipeRadius + 0.05, wipeRadius, wipeDist);
    col += edgeGlow * vec3(0.2, 0.25, 0.3) * 0.5;

    fragColor = vec4(col, 1.0);
}
