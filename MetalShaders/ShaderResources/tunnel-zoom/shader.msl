#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 tunnelZoomFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float depth = 1.0 / (r + 0.05);
    float texU = a / (2.0 * M_PI_F);
    float texV = depth - iTime * 1.5;

    float checker = step(0.5, fract(texU * 8.0)) * step(0.5, fract(texV * 4.0)) +
                    (1.0 - step(0.5, fract(texU * 8.0))) * (1.0 - step(0.5, fract(texV * 4.0)));

    float fog = 1.0 - exp(-r * 4.0);
    float3 colA = mix(float3(0.2, 0.0, 0.4), float3(0.8, 0.2, 0.5), checker);
    float3 colB = float3(0.0, 0.02, 0.05);
    float3 col = mix(colB, colA, fog);

    float rings = abs(sin(depth * 3.0 - iTime * 3.0));
    col += float3(0.1, 0.05, 0.2) * rings * fog * 0.3;

    float light = 0.5 + 0.5 * sin(a * 4.0 + iTime * 2.0);
    col *= 0.8 + 0.2 * light;

    float center = exp(-r * r * 8.0);
    col += float3(0.5, 0.3, 0.7) * center * 0.5;

    return float4(col, 1.0);
}
