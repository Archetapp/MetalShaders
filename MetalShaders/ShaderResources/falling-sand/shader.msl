#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float fallingSandHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float fallingSandHash3(float3 p) {
    return fract(sin(dot(p, float3(127.1, 311.7, 74.7))) * 43758.5453);
}

float fallingSandNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fallingSandHash(i);
    float b = fallingSandHash(i + float2(1.0, 0.0));
    float c = fallingSandHash(i + float2(0.0, 1.0));
    float d = fallingSandHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float3 fallingSandColor(float id) {
    float h = fract(id * 0.618);
    if (h < 0.2) return float3(0.85, 0.75, 0.5);
    if (h < 0.4) return float3(0.7, 0.3, 0.2);
    if (h < 0.6) return float3(0.4, 0.6, 0.3);
    if (h < 0.8) return float3(0.3, 0.4, 0.7);
    return float3(0.7, 0.5, 0.7);
}

fragment float4 fallingSandFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;

    float gridRes = 80.0;
    float2 gridUv = floor(uv * gridRes) / gridRes;
    float2 cellUv = fract(uv * gridRes);

    float cellX = gridUv.x;
    float cellY = gridUv.y;

    float numStreams = 6.0;
    float sandPresence = 0.0;
    float streamId = 0.0;

    for (float s = 0.0; s < 6.0; s++) {
        float streamX = 0.1 + s / numStreams * 0.8;
        streamX += sin(iTime * 0.3 + s * 2.0) * 0.08;
        float streamWidth = 0.03 + 0.02 * sin(iTime * 0.5 + s);

        float spawnRate = 0.7 + 0.3 * sin(iTime * 0.2 + s);
        float grain = fallingSandHash3(float3(gridUv * gridRes, floor(iTime * 10.0 + s * 100.0)));

        float timeFactor = min(iTime * 0.05, 0.6);

        float noiseOffset = fallingSandNoise(float2(cellX * 10.0 + s * 7.0, s)) * 0.1;
        float distFromStream = abs(cellX - streamX);
        float pileWidth = 0.15 + timeFactor * 0.2;
        float pileShape = max(0.0, 1.0 - distFromStream / pileWidth);
        pileShape = pileShape * pileShape;
        float pileHeight = pileShape * timeFactor * (0.5 + s * 0.08) + noiseOffset * timeFactor;

        float inPile = step(cellY, pileHeight);

        float inStream = smoothstep(streamWidth, 0.0, abs(cellX - streamX));
        float fallingGrain = inStream * step(grain, spawnRate * 0.3) * step(pileHeight, cellY);
        float grainJitter = fallingSandHash(gridUv * gridRes + s * 100.0 + floor(iTime * 15.0));
        fallingGrain *= step(0.6, grainJitter);

        if (inPile > 0.5 || fallingGrain > 0.3) {
            sandPresence = 1.0;
            streamId = s;
        }
    }

    float3 col;

    if (sandPresence > 0.5) {
        float3 baseCol = fallingSandColor(streamId);
        float grainNoise = fallingSandHash(gridUv * gridRes + streamId * 50.0);
        baseCol *= 0.8 + grainNoise * 0.4;

        float shadow = smoothstep(0.0, 0.5, cellY) * 0.3;
        baseCol *= 1.0 - shadow;

        float highlight = pow(grainNoise, 4.0) * 0.3;
        baseCol += float3(highlight);

        float edgeShadow = smoothstep(0.5, 0.0, min(cellUv.x, min(cellUv.y, min(1.0 - cellUv.x, 1.0 - cellUv.y))));
        baseCol *= 1.0 - edgeShadow * 0.15;

        col = baseCol;
    } else {
        float3 bgTop = float3(0.12, 0.12, 0.15);
        float3 bgBottom = float3(0.08, 0.08, 0.1);
        col = mix(bgBottom, bgTop, uv.y);

        float gridLine = smoothstep(0.02, 0.0, min(cellUv.x, cellUv.y));
        col += float3(0.03) * gridLine;

        for (float s = 0.0; s < 6.0; s++) {
            float streamX = 0.1 + s / numStreams * 0.8;
            streamX += sin(iTime * 0.3 + s * 2.0) * 0.08;
            float funnelGlow = exp(-abs(cellX - streamX) * 40.0) * smoothstep(0.8, 1.0, uv.y);
            col += fallingSandColor(s) * funnelGlow * 0.3;
        }
    }

    return float4(col, 1.0);
}
