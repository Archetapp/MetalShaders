#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float lightningHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float lightningNoise(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(lightningHash(i), lightningHash(i + 1.0), f);
}

float lightningBolt(vec2 uv, float seed, float yStart, float yEnd, float xCenter, float spread) {
    float segments = 30.0;
    float minDist = 1e6;

    vec2 prev = vec2(xCenter, yStart);
    for (float i = 1.0; i <= segments; i++) {
        float t = i / segments;
        float y = mix(yStart, yEnd, t);
        float offset = (lightningNoise(i * 3.7 + seed * 17.0) - 0.5) * spread;
        offset += (lightningNoise(i * 7.3 + seed * 31.0) - 0.5) * spread * 0.5;
        float x = xCenter + offset * t;

        vec2 curr = vec2(x, y);

        vec2 pa = uv - prev;
        vec2 ba = curr - prev;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);
        minDist = min(minDist, d);

        prev = curr;
    }

    return minDist;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

    float t = iTime;
    float strikeRate = 1.5;
    float strikeT = mod(t, strikeRate);
    float strikeId = floor(t / strikeRate);

    float intensity = exp(-strikeT * 4.0);
    float flash = exp(-strikeT * 8.0);

    vec3 col = vec3(0.02, 0.02, 0.06);
    col += vec3(0.1, 0.1, 0.2) * flash * 0.5;

    float seed = strikeId * 7.0;
    float xOff = (lightningHash(strikeId * 13.0) - 0.5) * 0.5;

    float d1 = lightningBolt(uv, seed, 0.5, -0.5, xOff, 0.3);

    float core = (0.003 / (d1 + 0.003)) * intensity;
    float glow = (0.03 / (d1 + 0.03)) * intensity * 0.5;
    float bloom = (0.15 / (d1 + 0.15)) * intensity * 0.15;

    col += vec3(0.7, 0.8, 1.0) * core;
    col += vec3(0.4, 0.5, 1.0) * glow;
    col += vec3(0.2, 0.2, 0.6) * bloom;

    if (lightningHash(seed + 1.0) > 0.3) {
        float branchY = mix(0.5, -0.5, lightningHash(seed + 2.0) * 0.6);
        float branchX = xOff + (lightningHash(seed + 3.0) - 0.5) * 0.15;
        float d2 = lightningBolt(uv, seed + 100.0, branchY, branchY - 0.3, branchX + 0.15, 0.15);
        float bc = (0.002 / (d2 + 0.002)) * intensity * 0.6;
        float bg = (0.02 / (d2 + 0.02)) * intensity * 0.3;
        col += vec3(0.5, 0.6, 1.0) * bc;
        col += vec3(0.2, 0.3, 0.7) * bg;
    }

    if (lightningHash(seed + 5.0) > 0.5) {
        float branchY = mix(0.5, -0.5, lightningHash(seed + 6.0) * 0.5 + 0.2);
        float branchX = xOff + (lightningHash(seed + 7.0) - 0.5) * 0.1;
        float d3 = lightningBolt(uv, seed + 200.0, branchY, branchY - 0.25, branchX - 0.12, 0.1);
        float bc2 = (0.002 / (d3 + 0.002)) * intensity * 0.4;
        col += vec3(0.4, 0.5, 1.0) * bc2;
    }

    col = pow(col, vec3(0.85));

    fragColor = vec4(col, 1.0);
}
