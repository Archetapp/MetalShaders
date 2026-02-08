#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float rdPaintHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float rdPaintNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(rdPaintHash(i), rdPaintHash(i + float2(1, 0)), f.x),
               mix(rdPaintHash(i + float2(0, 1)), rdPaintHash(i + float2(1, 1)), f.x), f.y);
}

fragment float4 reactionDiffusionPaintFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float pattern = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float2 seedPoint = float2(sin(fi * 2.1 + 1.0) * 0.3, cos(fi * 1.7 + 0.5) * 0.25);
        float seedTime = fi * 1.2;
        float growthTime = max(0.0, iTime - seedTime);
        float growthRadius = growthTime * 0.08;

        float dist = length(uv - seedPoint);
        if (dist < growthRadius + 0.2) {
            float growMask = smoothstep(growthRadius + 0.1, growthRadius - 0.05, dist);
            float scale = 15.0 + fi * 3.0;
            float n1 = rdPaintNoise(uv * scale + iTime * 0.1 + fi * 10.0);
            float n2 = rdPaintNoise(uv * scale * 2.0 - iTime * 0.15 + fi * 20.0);
            float n3 = rdPaintNoise(uv * scale * 0.5 + float2(iTime * 0.05));

            float rdPattern = sin(n1 * 10.0 + n2 * 5.0 + dist * 20.0) * 0.5 + 0.5;
            rdPattern *= sin(n2 * 8.0 - n3 * 6.0 + atan2(uv.y - seedPoint.y, uv.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
            rdPattern = smoothstep(0.3, 0.7, rdPattern);

            pattern += rdPattern * growMask;
        }
    }
    pattern = clamp(pattern, 0.0, 1.0);

    float3 bg = float3(0.95, 0.93, 0.88);
    float3 patternColor1 = float3(0.1, 0.3, 0.5);
    float3 patternColor2 = float3(0.5, 0.15, 0.2);
    float colorMix = rdPaintNoise(uv * 3.0 + iTime * 0.02);
    float3 patternColor = mix(patternColor1, patternColor2, colorMix);

    float3 col = mix(bg, patternColor, pattern);
    return float4(col, 1.0);
}
