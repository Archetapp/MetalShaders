#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float mpfHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 mpfHash2(vec2 p) {
    return vec2(mpfHash(p), mpfHash(p + vec2(37.0, 91.0)));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 magnetPos = hasInput ? mouseCentered : vec2(sin(iTime * 0.6) * 0.3, cos(iTime * 0.8) * 0.3);

    vec3 col = vec3(0.02, 0.01, 0.04);

    for (int i = 0; i < 80; i++) {
        vec2 seed = vec2(float(i) * 1.23, float(i) * 2.47);
        vec2 basePos = (mpfHash2(seed) - 0.5) * 1.2;

        vec2 toMagnet = magnetPos - basePos;
        float dist = length(toMagnet);
        vec2 dir = normalize(toMagnet);

        float orbitAngle = atan(toMagnet.y, toMagnet.x) + iTime * (0.5 + mpfHash(seed + 10.0));
        float orbitRadius = 0.05 + dist * 0.3;
        vec2 orbit = vec2(cos(orbitAngle), sin(orbitAngle)) * orbitRadius;

        float attraction = exp(-dist * 2.0) * 0.3;
        vec2 particlePos = basePos + dir * attraction + orbit * (1.0 - attraction);

        float particleDist = length(uv - particlePos);
        float brightness = mpfHash(seed + 20.0);

        float glow = exp(-particleDist * 60.0) * (0.5 + brightness * 0.5);
        float core = exp(-particleDist * 200.0) * 1.5;

        float hue = mpfHash(seed + 30.0) * 0.3 + 0.55;
        vec3 particleColor = 0.5 + 0.5 * cos(6.28 * (hue + vec3(0.0, 0.33, 0.67)));

        col += particleColor * glow + vec3(1.0) * core;
    }

    float fieldLines = 0.0;
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 0.785 + iTime * 0.2;
        vec2 dir = vec2(cos(angle), sin(angle));
        float lineField = abs(dot(uv - magnetPos, dir));
        lineField = exp(-lineField * 30.0) * exp(-length(uv - magnetPos) * 3.0);
        fieldLines += lineField;
    }
    col += fieldLines * vec3(0.1, 0.15, 0.3);

    float centerGlow = exp(-length(uv - magnetPos) * 8.0) * 0.15;
    col += centerGlow * vec3(0.3, 0.4, 0.8);

    col = pow(col, vec3(0.85));
    fragColor = vec4(col, 1.0);
}
