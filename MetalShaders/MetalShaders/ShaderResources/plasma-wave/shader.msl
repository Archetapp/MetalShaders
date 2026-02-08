#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 plasmaWaveFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float t = iTime * 0.8;

    float v1 = sin(uv.x * 10.0 + t);
    float v2 = sin(uv.y * 10.0 + t * 0.7);
    float v3 = sin((uv.x + uv.y) * 10.0 + t * 0.5);
    float v4 = sin(length(uv - 0.5) * 14.0 - t * 1.2);

    float v = (v1 + v2 + v3 + v4) * 0.25;

    float3 col;
    col.r = sin(v * M_PI_F + 0.0) * 0.5 + 0.5;
    col.g = sin(v * M_PI_F + 2.094) * 0.5 + 0.5;
    col.b = sin(v * M_PI_F + 4.189) * 0.5 + 0.5;

    return float4(col, 1.0);
}
