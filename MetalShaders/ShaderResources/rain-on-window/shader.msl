#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float rainWindowHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float rainWindowHash2(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float rainWindowNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0;
    return mix(mix(rainWindowHash(n), rainWindowHash(n + 1.0), f.x),
               mix(rainWindowHash(n + 157.0), rainWindowHash(n + 158.0), f.x), f.y);
}

float2 rainWindowDrop(float2 uv, float t, float id) {
    float speed = 0.3 + rainWindowHash(id * 13.7) * 0.4;
    float xWobble = sin(t * (1.0 + rainWindowHash(id * 7.3)) + id * 6.28) * 0.01;

    float cellY = fract(uv.y * 0.5 + t * speed + rainWindowHash(id) * 100.0);
    float cellX = uv.x + xWobble;

    float dropX = rainWindowHash(id * 3.14 + floor(uv.y * 0.5 + t * speed + rainWindowHash(id) * 100.0)) * 0.8 + 0.1;
    float dx = cellX - dropX;
    float dy = cellY - 0.5;

    float dropSize = 0.02 + rainWindowHash(id * 5.7) * 0.015;
    float drop = smoothstep(dropSize, dropSize * 0.3, length(float2(dx, dy * 2.0)));

    float trail = smoothstep(0.008, 0.0, abs(dx)) * smoothstep(0.5, 0.8, cellY) * 0.5;
    float trailDroplets = smoothstep(0.006, 0.0, abs(dx)) * step(0.7, rainWindowHash2(float2(floor(cellY * 20.0), id)));
    trail += trailDroplets * 0.3;

    float distortion = (drop + trail * 0.5) * 0.05;
    float2 normal = float2(dx, dy) * drop * 3.0;

    return normal * distortion * 10.0;
}

float3 rainWindowBackground(float2 uv, float t) {
    float3 col1 = float3(0.15, 0.18, 0.25);
    float3 col2 = float3(0.08, 0.1, 0.15);
    float3 col3 = float3(0.2, 0.15, 0.1);

    float n = rainWindowNoise(uv * 3.0 + t * 0.02);
    float3 bg = mix(col1, col2, uv.y);
    bg = mix(bg, col3, n * 0.3);

    float light1 = exp(-length(uv - float2(0.3, 0.7)) * 3.0) * 0.4;
    float light2 = exp(-length(uv - float2(0.7, 0.6)) * 4.0) * 0.3;
    bg += float3(1.0, 0.9, 0.7) * light1;
    bg += float3(0.7, 0.8, 1.0) * light2;

    float light3 = exp(-length(uv - float2(0.5, 0.4)) * 2.5) * 0.2;
    bg += float3(1.0, 0.6, 0.3) * light3;

    return bg;
}

fragment float4 rainOnWindowFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;

    float2 totalRefraction = float2(0.0);

    for (int layer = 0; layer < 3; layer++) {
        float layerScale = 1.0 + float(layer) * 0.5;
        float layerId = float(layer) * 100.0;
        float2 layerUv = uv * float2(aspect * layerScale, layerScale);

        for (int i = 0; i < 8; i++) {
            float id = layerId + float(i);
            float2 cellUv = layerUv;
            cellUv.x += rainWindowHash(id) * 2.0;
            totalRefraction += rainWindowDrop(cellUv, iTime, id) * (1.0 / layerScale);
        }
    }

    float2 refractedUv = uv + totalRefraction;
    float3 bg = rainWindowBackground(refractedUv, iTime);

    float dropMask = length(totalRefraction) * 20.0;
    bg += float3(0.15, 0.2, 0.25) * dropMask;

    float fogAmount = 0.15;
    float3 fogColor = float3(0.12, 0.14, 0.18);
    bg = mix(bg, fogColor, fogAmount);

    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    vignette = smoothstep(0.0, 1.0, vignette);
    bg *= vignette;

    return float4(bg, 1.0);
}
