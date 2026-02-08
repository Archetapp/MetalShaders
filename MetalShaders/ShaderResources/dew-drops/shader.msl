#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float dewDropHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float2 dewDropHash2(float2 p) { return float2(dewDropHash(p), dewDropHash(p + float2(37.0, 91.0))); }

fragment float4 dewDropsFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;
    float3 leafColor = float3(0.15, 0.4, 0.1);
    leafColor += abs(sin(centered.x * 20.0 + centered.y * 5.0)) * 0.1 * float3(0.0, 0.15, 0.0);
    float3 col = leafColor;
    float scale = 12.0;
    for (int layer = 0; layer < 3; layer++) {
        float s = scale + float(layer) * 8.0;
        float2 gridUv = uv * s;
        float2 cellId = floor(gridUv);
        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                float2 id = cellId + float2(float(dx), float(dy));
                float2 h = dewDropHash2(id + float(layer) * 100.0);
                float maxRadius = 0.15 + h.x * 0.2;
                float radius = min(maxRadius, (sin(iTime * (0.1 + h.y * 0.15) + h.x * 6.28) * 0.5 + 0.5) * maxRadius);
                float2 dropCenter = (id + 0.5 + (h - 0.5) * 0.4) / s;
                float2 dropUv = uv - dropCenter;
                float dist = length(dropUv * s);
                if (dist < radius * s) {
                    float nd = dist / (radius * s);
                    float sh = sqrt(max(0.0, 1.0 - nd * nd));
                    float highlight = pow(max(0.0, 1.0 - length(dropUv * s - float2(-radius * 0.3, radius * 0.3) * s) / (radius * s * 0.4)), 3.0);
                    float dropMask = smoothstep(radius * s, radius * s * 0.9, dist);
                    float3 dropColor = leafColor * (1.0 + pow(sh, 0.5) * 0.15);
                    dropColor += highlight * float3(0.8, 0.9, 1.0);
                    col = mix(col, dropColor, 1.0 - dropMask);
                }
            }
        }
    }
    return float4(col, 1.0);
}
