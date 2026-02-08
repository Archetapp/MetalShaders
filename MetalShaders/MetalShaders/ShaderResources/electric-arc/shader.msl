#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float eaHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float eaNoise(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(eaHash(i), eaHash(i + 1.0), f);
}

float eaLightning(float2 uv, float2 p0, float2 p1, float t, float seed) {
    float segments = 20.0;
    float intensity = 0.0;
    float2 dir = p1 - p0;
    float2 norm = normalize(dir);
    float2 perp = float2(-norm.y, norm.x);

    for (float i = 0.0; i < 20.0; i++) {
        float frac1 = i / segments;
        float frac2 = (i + 1.0) / segments;

        float displacement1 = (eaNoise(frac1 * 8.0 + t * 12.0 + seed) - 0.5) * 0.15;
        float displacement2 = (eaNoise(frac2 * 8.0 + t * 12.0 + seed) - 0.5) * 0.15;

        displacement1 *= sin(frac1 * M_PI_F);
        displacement2 *= sin(frac2 * M_PI_F);

        float2 a = p0 + dir * frac1 + perp * displacement1;
        float2 b = p0 + dir * frac2 + perp * displacement2;

        float2 pa = uv - a;
        float2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);

        float glow = 0.003 / (d * d + 0.0001);
        intensity += glow;

        if (fmod(i, 5.0) < 1.0) {
            float2 branchDir = perp * sign(displacement1) * 0.08;
            for (float j = 0.0; j < 5.0; j++) {
                float bf1 = j / 5.0;
                float bf2 = (j + 1.0) / 5.0;
                float bd1 = (eaNoise(bf1 * 4.0 + t * 15.0 + seed + i) - 0.5) * 0.03;
                float bd2 = (eaNoise(bf2 * 4.0 + t * 15.0 + seed + i) - 0.5) * 0.03;
                float2 ba2 = a + branchDir * bf1 + norm * bd1;
                float2 bb = a + branchDir * bf2 + norm * bd2;
                float2 pa2 = uv - ba2;
                float2 bab = bb - ba2;
                float h2 = clamp(dot(pa2, bab) / dot(bab, bab), 0.0, 1.0);
                float d2 = length(pa2 - bab * h2);
                intensity += 0.001 / (d2 * d2 + 0.0002) * (1.0 - bf1);
            }
        }
    }
    return intensity;
}

fragment float4 electricArcFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

    float t = iTime;

    float2 p0 = float2(cos(t * 0.5) * 0.35, sin(t * 0.7) * 0.25);
    float2 p1 = float2(cos(t * 0.5 + M_PI_F) * 0.35, sin(t * 0.7 + M_PI_F) * 0.25);

    float flicker = eaNoise(t * 20.0) * 0.5 + 0.5;

    float lightning1 = eaLightning(uv, p0, p1, t, 0.0) * flicker;
    float lightning2 = eaLightning(uv, p0, p1, t, 17.3) * eaNoise(t * 15.0 + 5.0);
    float lightning3 = eaLightning(uv, p0, p1, t, 31.7) * eaNoise(t * 18.0 + 10.0) * 0.5;

    float total = lightning1 + lightning2 + lightning3;

    float3 coreColor = float3(0.9, 0.95, 1.0);
    float3 glowColor = float3(0.3, 0.5, 1.0);
    float3 outerGlow = float3(0.1, 0.15, 0.4);

    float3 col = float3(0.0);
    col += coreColor * min(total * 0.02, 2.0);
    col += glowColor * min(total * 0.005, 1.0);
    col += outerGlow * min(total * 0.001, 0.5);

    float pointGlow0 = 0.01 / (length(uv - p0) + 0.01);
    float pointGlow1 = 0.01 / (length(uv - p1) + 0.01);
    col += float3(0.4, 0.6, 1.0) * (pointGlow0 + pointGlow1);

    float vignette = 1.0 - length(uv) * 0.5;
    col *= vignette;

    col = 1.0 - exp(-col * 1.5);

    return float4(col, 1.0);
}
