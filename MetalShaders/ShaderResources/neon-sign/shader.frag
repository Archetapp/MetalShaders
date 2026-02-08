#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float nsSegH(vec2 p, float w) {
    p.x -= clamp(p.x, -w, w);
    return length(p);
}

float nsSegV(vec2 p, float h) {
    p.y -= clamp(p.y, -h, h);
    return length(p);
}

float nsCharH(vec2 p) {
    float d = 1e9;
    d = min(d, nsSegV(p - vec2(-0.15, 0.0), 0.25));
    d = min(d, nsSegV(p - vec2(0.15, 0.0), 0.25));
    d = min(d, nsSegH(p, 0.12));
    return d;
}

float nsCharE(vec2 p) {
    float d = 1e9;
    d = min(d, nsSegV(p - vec2(-0.15, 0.0), 0.25));
    d = min(d, nsSegH(p - vec2(-0.015, 0.25), 0.12));
    d = min(d, nsSegH(p - vec2(-0.015, 0.0), 0.1));
    d = min(d, nsSegH(p - vec2(-0.015, -0.25), 0.12));
    return d;
}

float nsCharL(vec2 p) {
    float d = 1e9;
    d = min(d, nsSegV(p - vec2(-0.15, 0.0), 0.25));
    d = min(d, nsSegH(p - vec2(0.0, -0.25), 0.12));
    return d;
}

float nsCharO(vec2 p) {
    float d = 1e9;
    d = min(d, nsSegV(p - vec2(-0.15, 0.0), 0.25));
    d = min(d, nsSegV(p - vec2(0.15, 0.0), 0.25));
    d = min(d, nsSegH(p - vec2(0.0, 0.25), 0.12));
    d = min(d, nsSegH(p - vec2(0.0, -0.25), 0.12));
    return d;
}

float nsText(vec2 p) {
    float d = 1e9;
    float spacing = 0.45;
    d = min(d, nsCharH(p - vec2(-2.0 * spacing, 0.0)));
    d = min(d, nsCharE(p - vec2(-1.0 * spacing, 0.0)));
    d = min(d, nsCharL(p - vec2(0.0, 0.0)));
    d = min(d, nsCharL(p - vec2(1.0 * spacing, 0.0)));
    d = min(d, nsCharO(p - vec2(2.0 * spacing, 0.0)));
    return d;
}

float nsFlicker(float t) {
    float f = sin(t * 60.0) * 0.5 + 0.5;
    f *= sin(t * 37.0) * 0.5 + 0.5;
    return smoothstep(0.1, 0.3, f) * 0.3 + 0.7;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

    float t = iTime;

    vec3 wallColor = vec3(0.03, 0.03, 0.05);
    float brickX = fract(uv.x * 8.0 + step(1.0, mod(floor(uv.y * 16.0), 2.0)) * 0.5);
    float brickY = fract(uv.y * 16.0);
    float brick = smoothstep(0.0, 0.05, brickX) * smoothstep(0.0, 0.05, brickY);
    wallColor *= 0.8 + 0.2 * brick;

    float d = nsText(uv * 1.2);

    vec3 neonColor = vec3(1.0, 0.1, 0.3);
    float flicker = nsFlicker(t);
    float flicker2 = nsFlicker(t * 1.1 + 3.14);

    float tube = smoothstep(0.035, 0.025, d);
    float glow = 0.01 / (d * d + 0.001);
    float halo = exp(-d * 3.0);
    float bigHalo = exp(-d * 0.8);

    vec3 tubeColor = vec3(1.0, 0.8, 0.85) * tube;
    vec3 glowColor = neonColor * glow * 0.02 * flicker;
    vec3 haloColor = neonColor * halo * 0.6 * flicker;
    vec3 bigHaloColor = neonColor * bigHalo * 0.15 * flicker;

    vec3 col = wallColor;
    col += bigHaloColor;
    col += haloColor;
    col += glowColor;
    col += tubeColor * flicker;

    col += wallColor * neonColor * bigHalo * 0.3 * flicker;

    float spec = pow(max(0.0, 1.0 - d * 20.0), 4.0) * 0.3;
    col += vec3(1.0) * spec * flicker2;

    col = col / (col + 0.5);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
