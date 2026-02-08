#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float condensationHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float2 condensationHash2(float2 p) { return float2(condensationHash(p), condensationHash(p + float2(37.0, 91.0))); }

fragment float4 condensationFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float3 behindGlass = float3(0.15, 0.2, 0.25);
    behindGlass += 0.05 * sin(centered.x * 3.0 + iTime * 0.1);
    float3 col = behindGlass;
    float totalDroplet = 0.0;

    for (float scale = 20.0; scale <= 60.0; scale += 20.0) {
        float2 gridUv = uv * scale;
        float2 cellId = floor(gridUv);
        float2 cellLocal = fract(gridUv) - 0.5;

        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                float2 neighbor = float2(float(x), float(y));
                float2 id = cellId + neighbor;
                float2 h = condensationHash2(id);
                float birthTime = h.x * 10.0;
                float alive = smoothstep(birthTime, birthTime + 0.5, iTime);
                float maxSize = 0.1 + h.y * 0.3;
                float growRate = 0.02 + h.x * 0.03;
                float size = min(maxSize, (iTime - birthTime) * growRate) * alive;
                float2 offset = (h - 0.5) * 0.6;
                float2 dropPos = neighbor + offset - cellLocal;
                float dist = length(dropPos);
                float droplet = smoothstep(size, size * 0.3, dist);
                float highlight = smoothstep(size * 0.6, size * 0.2, length(dropPos - float2(-0.05, 0.05) * size * 5.0));
                col = mix(col, float3(0.18, 0.23, 0.28), droplet * 0.3);
                col += highlight * float3(0.4, 0.45, 0.5) * droplet;
                totalDroplet = max(totalDroplet, droplet);
            }
        }
    }

    float fogLayer = 0.3 + 0.1 * sin(centered.y * 2.0 + iTime * 0.1);
    col = mix(col, float3(0.6, 0.65, 0.7), fogLayer * (1.0 - totalDroplet));
    return float4(col, 1.0);
}
