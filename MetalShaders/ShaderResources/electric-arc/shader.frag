#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float eaHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float eaNoise(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(eaHash(i), eaHash(i + 1.0), f);
}

float eaLightning(vec2 uv, vec2 p0, vec2 p1, float t, float seed) {
    float segments = 20.0;
    float intensity = 0.0;
    vec2 dir = p1 - p0;
    float len = length(dir);
    vec2 norm = normalize(dir);
    vec2 perp = vec2(-norm.y, norm.x);

    for (float i = 0.0; i < 20.0; i++) {
        float frac1 = i / segments;
        float frac2 = (i + 1.0) / segments;

        float displacement1 = (eaNoise(frac1 * 8.0 + t * 12.0 + seed) - 0.5) * 0.15;
        float displacement2 = (eaNoise(frac2 * 8.0 + t * 12.0 + seed) - 0.5) * 0.15;

        displacement1 *= sin(frac1 * 3.14159);
        displacement2 *= sin(frac2 * 3.14159);

        vec2 a = p0 + dir * frac1 + perp * displacement1;
        vec2 b = p0 + dir * frac2 + perp * displacement2;

        vec2 pa = uv - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);

        float glow = 0.003 / (d * d + 0.0001);
        intensity += glow;

        if (mod(i, 5.0) < 1.0) {
            vec2 branchDir = perp * sign(displacement1) * 0.08;
            for (float j = 0.0; j < 5.0; j++) {
                float bf1 = j / 5.0;
                float bf2 = (j + 1.0) / 5.0;
                float bd1 = (eaNoise(bf1 * 4.0 + t * 15.0 + seed + i) - 0.5) * 0.03;
                float bd2 = (eaNoise(bf2 * 4.0 + t * 15.0 + seed + i) - 0.5) * 0.03;
                vec2 ba2 = a + branchDir * bf1 + norm * bd1;
                vec2 bb = a + branchDir * bf2 + norm * bd2;
                vec2 pa2 = uv - ba2;
                vec2 bab = bb - ba2;
                float h2 = clamp(dot(pa2, bab) / dot(bab, bab), 0.0, 1.0);
                float d2 = length(pa2 - bab * h2);
                intensity += 0.001 / (d2 * d2 + 0.0002) * (1.0 - bf1);
            }
        }
    }
    return intensity;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float t = iTime;

    vec2 p0 = vec2(cos(t * 0.5) * 0.35, sin(t * 0.7) * 0.25);
    vec2 p1 = vec2(cos(t * 0.5 + 3.14159) * 0.35, sin(t * 0.7 + 3.14159) * 0.25);

    float flicker = eaNoise(t * 20.0) * 0.5 + 0.5;

    float lightning1 = eaLightning(uv, p0, p1, t, 0.0) * flicker;
    float lightning2 = eaLightning(uv, p0, p1, t, 17.3) * eaNoise(t * 15.0 + 5.0);
    float lightning3 = eaLightning(uv, p0, p1, t, 31.7) * eaNoise(t * 18.0 + 10.0) * 0.5;

    float total = lightning1 + lightning2 + lightning3;

    vec3 coreColor = vec3(0.9, 0.95, 1.0);
    vec3 glowColor = vec3(0.3, 0.5, 1.0);
    vec3 outerGlow = vec3(0.1, 0.15, 0.4);

    vec3 col = vec3(0.0);
    col += coreColor * min(total * 0.02, 2.0);
    col += glowColor * min(total * 0.005, 1.0);
    col += outerGlow * min(total * 0.001, 0.5);

    float pointGlow0 = 0.01 / (length(uv - p0) + 0.01);
    float pointGlow1 = 0.01 / (length(uv - p1) + 0.01);
    col += vec3(0.4, 0.6, 1.0) * (pointGlow0 + pointGlow1);

    float vignette = 1.0 - length(uv) * 0.5;
    col *= vignette;

    col = 1.0 - exp(-col * 1.5);

    fragColor = vec4(col, 1.0);
}
