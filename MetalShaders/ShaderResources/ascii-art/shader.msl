#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float asciiCharMtl(float2 p, float brightness) {
    p = clamp(p, 0.0, 1.0);
    int level = int(brightness * 9.99);
    float px = p.x, py = p.y;
    float d = 1.0;

    if (level <= 1) return 0.0;
    if (level == 2) { d = abs(py - 0.5); return smoothstep(0.15, 0.05, d); }
    if (level == 3) {
        d = min(abs(px - 0.5), abs(py - 0.5));
        return smoothstep(0.15, 0.05, d) * step(0.2, px) * step(px, 0.8) * step(0.2, py) * step(py, 0.8);
    }
    if (level == 4) { d = min(abs(px - 0.5), abs(py - 0.5)); return smoothstep(0.12, 0.05, d); }
    if (level == 5) { d = abs(length(p - 0.5) - 0.3); return smoothstep(0.1, 0.03, d); }
    if (level == 6) { d = min(abs(px - py), abs(px - (1.0 - py))); return smoothstep(0.12, 0.04, d); }
    if (level == 7) { d = min(min(abs(px - 0.5), abs(py - 0.5)), min(abs(px - py), abs(px - (1.0 - py)))); return smoothstep(0.1, 0.03, d); }
    if (level >= 8) { return smoothstep(0.05, -0.05, length(p - 0.5) - 0.35); }
    return 0.0;
}

fragment float4 asciiArtFragment(VertexOut in [[stage_in]],
                                  constant float &iTime [[buffer(0)]],
                                  constant float2 &iResolution [[buffer(1)]]) {
    float cellSize = 8.0;
    float2 cell = floor(in.position.xy / cellSize);
    float2 cellUV = fract(in.position.xy / cellSize);
    float2 cellCenter = (cell * cellSize + cellSize * 0.5 - 0.5 * iResolution) / iResolution.y;

    float r = length(cellCenter);
    float a = atan2(cellCenter.y, cellCenter.x);
    float scene = 0.5 + 0.5 * sin(r * 10.0 - iTime * 2.0 + a * 3.0);
    scene *= smoothstep(0.5, 0.1, r);
    scene += 0.3 * sin(cellCenter.x * 5.0 + iTime) * sin(cellCenter.y * 5.0 + iTime * 0.7);
    scene = clamp(scene, 0.0, 1.0);

    float ch = asciiCharMtl(cellUV, scene);
    float3 charCol = 0.5 + 0.5 * cos(iTime * 0.5 + float3(cellCenter.x, cellCenter.y, cellCenter.x) * 3.0 + float3(0.0, 2.0, 4.0));
    float3 col = mix(float3(0.02, 0.02, 0.04), charCol, ch);

    return float4(col, 1.0);
}
