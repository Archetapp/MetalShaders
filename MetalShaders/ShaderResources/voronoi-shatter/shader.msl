#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 vsHash2(float2 p) {
    p = float2(dot(p, float2(127.1, 311.7)), dot(p, float2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float3 vsVoronoi(float2 x) {
    float2 n = floor(x);
    float2 f = fract(x);
    float md = 8.0;
    float2 mr;
    float2 cellId;
    for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
        float2 g = float2(float(i), float(j));
        float2 o = vsHash2(n + g);
        float2 r = g + o - f;
        float d = dot(r, r);
        if (d < md) {
            md = d;
            mr = r;
            cellId = n + g;
        }
    }
    float md2 = 8.0;
    for (int j = -2; j <= 2; j++)
    for (int i = -2; i <= 2; i++) {
        float2 g = float2(float(i), float(j));
        float2 o = vsHash2(n + g);
        float2 r = g + o - f;
        if (dot(r - mr, r - mr) > 0.00001) {
            md2 = min(md2, dot(0.5 * (mr + r), normalize(r - mr)));
        }
    }
    return float3(md, md2, cellId.x + cellId.y * 37.0);
}

fragment float4 voronoiShatterFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float2 uvOrig = in.uv;

    float cycle = fmod(iTime, 6.0);
    float shatterProgress = smoothstep(1.0, 3.5, cycle);
    float reformProgress = smoothstep(4.0, 5.8, cycle);
    float progress = shatterProgress * (1.0 - reformProgress);

    float scale = 6.0;
    float3 vor = vsVoronoi(uv * scale);
    float cellDist = vor.x;
    float edgeDist = vor.y;
    float cellHash = fract(vor.z * 0.1731);

    float fallDelay = cellHash * 0.5;
    float cellProgress = clamp((progress - fallDelay) / (1.0 - fallDelay), 0.0, 1.0);

    float fallDist = cellProgress * cellProgress * 0.8;
    float rotation = cellProgress * (cellHash - 0.5) * 3.14159;
    float2 fallDir = normalize(float2(cellHash - 0.5, -1.0));

    float2 offset = fallDir * fallDist * progress;

    float2 sampleUV = uvOrig - offset;
    float cosR = cos(rotation * progress);
    float sinR = sin(rotation * progress);
    float2 center = float2(0.5);
    sampleUV = center + float2x2(cosR, -sinR, sinR, cosR) * (sampleUV - center);

    float3 sceneColor = float3(0.0);
    sceneColor += 0.15 * float3(0.3 + 0.7 * sin(sampleUV.x * 6.28 + iTime),
                                 0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                                 0.3 + 0.7 * sin((sampleUV.x + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0));
    sceneColor += 0.3;

    float refraction = progress * 0.02 * (1.0 - edgeDist);
    float3 col = float3(0.0);
    col.r = (float3(0.3 + 0.7 * sin((sampleUV.x + refraction) * 6.28 + iTime),
                     0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                     0.3 + 0.7 * sin(((sampleUV.x + refraction) + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0)) * 0.15 + 0.3).r;
    col.g = sceneColor.g;
    col.b = (float3(0.3 + 0.7 * sin((sampleUV.x - refraction) * 6.28 + iTime),
                     0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                     0.3 + 0.7 * sin(((sampleUV.x - refraction) + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0)) * 0.15 + 0.3).b;

    float edge = 1.0 - smoothstep(0.0, 0.05, edgeDist);
    float3 edgeColor = float3(0.8, 0.85, 0.9);
    col = mix(col, edgeColor, edge * 0.7 * progress);

    float highlight = pow(max(0.0, 1.0 - cellDist * 2.0), 3.0);
    col += highlight * 0.15 * progress * float3(0.9, 0.95, 1.0);

    float glassReflect = pow(1.0 - abs(dot(normalize(float3(uv, 1.0)), float3(0.0, 0.0, 1.0))), 3.0);
    col += glassReflect * 0.1 * progress * float3(0.7, 0.8, 1.0);

    float alpha = 1.0 - cellProgress * 0.3;
    col *= alpha;

    float shadow = smoothstep(0.0, 0.3, progress) * 0.2;
    float3 bgColor = float3(0.05, 0.05, 0.07);
    float fragMask = 1.0 - step(0.99, cellProgress);
    col = mix(bgColor + shadow, col, fragMask + (1.0 - progress));

    return float4(col, 1.0);
}
