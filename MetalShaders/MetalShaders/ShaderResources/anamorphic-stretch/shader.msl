#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 anamorphicStretchFragment(VertexOut in [[stage_in]],
                                           constant float &iTime [[buffer(0)]],
                                           constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float distFromCenter = length(uv);
    float anamorphFactor = 1.0 + 3.0 * exp(-distFromCenter * distFromCenter * 8.0);
    anamorphFactor *= 1.0 + 0.3 * sin(iTime);

    float2 distorted = uv;
    distorted.y *= anamorphFactor;

    float checker = step(0.5, fract(distorted.x * 5.0)) + step(0.5, fract(distorted.y * 5.0));
    checker = fmod(checker, 2.0);

    float3 col1 = float3(0.9, 0.3, 0.2);
    float3 col2 = float3(0.2, 0.3, 0.8);
    float3 col = mix(col1, col2, checker);

    float circle = smoothstep(0.12, 0.11, length(distorted - float2(0.0, 0.2 + sin(iTime) * 0.1)));
    col = mix(col, float3(1.0, 0.9, 0.2), circle);

    float star = 0.0;
    for (int i = 0; i < 5; i++) {
        float a = float(i) * 1.2566;
        float2 sp = distorted - float2(cos(a) * 0.15, sin(a) * 0.15);
        star += smoothstep(0.03, 0.02, length(sp));
    }
    col = mix(col, float3(0.2, 0.8, 0.3), clamp(star, 0.0, 1.0));

    float grid = smoothstep(0.02, 0.0, abs(fract(distorted.x * 10.0) - 0.5) - 0.48) +
                 smoothstep(0.02, 0.0, abs(fract(distorted.y * 10.0) - 0.5) - 0.48);
    col = mix(col, float3(0.0), clamp(grid, 0.0, 1.0) * 0.15);

    float vignette = 1.0 - smoothstep(0.3, 0.6, distFromCenter);
    col *= 0.7 + 0.3 * vignette;

    return float4(col, 1.0);
}
