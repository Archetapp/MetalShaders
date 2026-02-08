#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 interferenceRingsFragment(VertexOut in [[stage_in]],
                                           constant float &iTime [[buffer(0)]],
                                           constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float wave = 0.0;

    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = fi * 1.2566 + iTime * 0.3;
        float dist = 0.2 + 0.05 * sin(iTime * 0.5 + fi);
        float2 center = float2(cos(angle), sin(angle)) * dist;
        float r = length(uv - center);
        wave += sin(r * 60.0 - iTime * 4.0 + fi) / (1.0 + r * 5.0);
    }

    wave *= 0.3;
    float3 col = float3(0.0);
    col.r = 0.5 + 0.5 * sin(wave * 3.0);
    col.g = 0.5 + 0.5 * sin(wave * 3.0 + 2.094);
    col.b = 0.5 + 0.5 * sin(wave * 3.0 + 4.189);

    col *= 0.1 + 0.9 * (0.5 + 0.5 * wave);

    float bright = abs(wave) * 0.5;
    col += bright * float3(0.1, 0.1, 0.2);

    return float4(col, 1.0);
}
