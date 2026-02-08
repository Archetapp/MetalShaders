#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 hash2(float2 p) {
    p = float2(dot(p, float2(127.1, 311.7)), dot(p, float2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

fragment float4 voronoiCellsFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv * 5.0;

    float2 cellId = floor(uv);
    float2 cellUv = fract(uv);

    float minDist = 1.0;
    float2 closestPoint;
    float2 closestCell;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            float2 neighbor = float2(float(x), float(y));
            float2 point = hash2(cellId + neighbor);
            point = 0.5 + 0.5 * sin(iTime * 0.6 + 6.2831 * point);

            float dist = length(neighbor + point - cellUv);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
                closestCell = cellId + neighbor;
            }
        }
    }

    float3 cellColor = 0.5 + 0.5 * cos(
        6.2831 * hash2(closestCell).x + float3(0.0, 1.0, 2.0)
    );

    float edge = smoothstep(0.0, 0.05, minDist);
    float3 col = cellColor * edge + (1.0 - edge) * float3(0.95);

    return float4(col, 1.0);
}
