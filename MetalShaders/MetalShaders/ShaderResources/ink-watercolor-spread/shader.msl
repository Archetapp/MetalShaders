#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float inkWaterHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float inkWaterNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(inkWaterHash(i), inkWaterHash(i + float2(1,0)), f.x),
               mix(inkWaterHash(i + float2(0,1)), inkWaterHash(i + float2(1,1)), f.x), f.y);
}
float inkWaterFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * inkWaterNoise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

fragment float4 inkWatercolorSpreadFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float paperGrain = inkWaterFbm(uv * 40.0) * 0.08;
    float3 paperColor = float3(0.95, 0.93, 0.88) - paperGrain;

    float ink = 0.0;
    float3 inkColor = float3(0.0);
    float3 colors[4] = {float3(0.1, 0.1, 0.3), float3(0.6, 0.1, 0.15), float3(0.05, 0.2, 0.1), float3(0.4, 0.2, 0.05)};

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float2 dropPos = float2(sin(fi * 2.3 + 0.5) * 0.25, cos(fi * 1.8 + 1.0) * 0.2);
        float dropTime = max(0.0, iTime * 0.3 - fi * 0.8);
        float baseRadius = dropTime * 0.12;
        float noiseDistort = inkWaterFbm(uv * 8.0 + fi * 10.0 + iTime * 0.02) * 0.15;
        float grainFollow = inkWaterFbm(uv * 20.0 + fi * 5.0) * 0.08;
        float dist = length(uv - dropPos);
        float dropMask = smoothstep(baseRadius + noiseDistort + grainFollow, baseRadius * 0.5, dist);
        float edgeDarken = smoothstep(baseRadius * 0.3, baseRadius + noiseDistort, dist);
        float concentrate = 0.3 + 0.7 * edgeDarken;
        float blend = dropMask * concentrate;
        ink += blend;
        inkColor += colors[i] * blend;
    }

    ink = clamp(ink, 0.0, 1.0);
    inkColor = ink > 0.001 ? inkColor / ink : float3(0.0);
    float3 col = mix(paperColor, inkColor, ink * 0.8);
    float paperTexture = inkWaterNoise(uv * 100.0) * 0.03;
    col += paperTexture * (1.0 - ink * 0.5);
    return float4(col, 1.0);
}
