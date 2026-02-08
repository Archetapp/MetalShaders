#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 palette(float t) {
    float3 a = float3(0.5, 0.5, 0.5);
    float3 b = float3(0.5, 0.5, 0.5);
    float3 c = float3(1.0, 1.0, 1.0);
    float3 d = float3(0.0, 0.1, 0.2);
    return a + b * cos(6.28318 * (c * t + d));
}

fragment float4 mandelbrotFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float t = iTime * 0.05;
    float zoom = pow(1.5, t);
    zoom = max(zoom, 0.5);

    float2 center = float2(-0.7453, 0.1127);
    float2 c = center + uv / zoom;

    float2 z = float2(0.0);
    float iter = 0.0;
    const float maxIter = 256.0;

    for (float i = 0.0; i < maxIter; i++) {
        if (dot(z, z) > 4.0) break;
        z = float2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iter = i;
    }

    if (dot(z, z) > 4.0) {
        float sl = iter - log2(log2(dot(z, z))) + 4.0;
        float normalized = sl / maxIter;
        float3 col = palette(normalized * 4.0 + iTime * 0.1);
        return float4(col, 1.0);
    } else {
        return float4(0.0, 0.0, 0.0, 1.0);
    }
}
