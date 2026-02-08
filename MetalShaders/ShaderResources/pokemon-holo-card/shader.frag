#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float holoHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float holoNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = holoHash(i);
    float b = holoHash(i + vec2(1.0, 0.0));
    float c = holoHash(i + vec2(0.0, 1.0));
    float d = holoHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float holoFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 5; i++) {
        v += a * holoNoise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

vec3 holoRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centeredUv = uv * 2.0 - 1.0;
    centeredUv.x *= iResolution.x / iResolution.y;

    float viewAngleX = sin(iTime * 0.7) * 0.5;
    float viewAngleY = cos(iTime * 0.5) * 0.3;
    vec3 viewDir = normalize(vec3(viewAngleX, viewAngleY, 1.0));

    float noiseVal = holoFbm(uv * 4.0 + iTime * 0.1);
    vec2 distortedUv = uv + vec2(noiseVal * 0.05, noiseVal * 0.03);

    float diffraction = dot(distortedUv, viewDir.xy) * 8.0;
    diffraction += noiseVal * 2.0;

    vec3 rainbow1 = holoRainbow(diffraction + iTime * 0.3);
    vec3 rainbow2 = holoRainbow(diffraction * 1.5 - iTime * 0.2 + 0.5);

    float gratingPattern = sin(distortedUv.x * 120.0 + viewAngleX * 40.0) * 0.5 + 0.5;
    gratingPattern *= sin(distortedUv.y * 80.0 + viewAngleY * 30.0) * 0.5 + 0.5;

    float sparkle = pow(holoNoise(uv * 30.0 + iTime * 0.5), 8.0) * 2.0;

    vec3 baseColor = vec3(0.85, 0.85, 0.88);
    vec3 holoColor = mix(rainbow1, rainbow2, gratingPattern);

    float fresnelLike = 1.0 - abs(dot(normalize(centeredUv.xyy), viewDir));
    fresnelLike = pow(fresnelLike, 2.0);

    float holoStrength = 0.5 + 0.3 * sin(iTime * 0.4) + fresnelLike * 0.3;

    vec3 col = mix(baseColor, holoColor, holoStrength);
    col += sparkle * holoColor;

    float specular = pow(max(dot(reflect(-viewDir, vec3(0.0, 0.0, 1.0)), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);
    col += vec3(specular * 0.5);

    float cardBorder = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, uv.y) *
                       smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.y);
    col *= cardBorder;

    float cornerRadius = 0.03;
    vec2 cornerDist = max(abs(centeredUv) - (vec2(iResolution.x / iResolution.y, 1.0) - cornerRadius), 0.0);
    float cornerMask = 1.0 - smoothstep(cornerRadius - 0.01, cornerRadius, length(cornerDist));
    col *= cornerMask;

    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
