#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 voronoiShatterHash2(float2 p) {
    p = float2(dot(p, float2(127.1, 311.7)), dot(p, float2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

fragment float4 voronoiGlassShatterFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float cycleTime = 4.0;
    float t = fmod(iTime, cycleTime);
    float shatterProgress = smoothstep(0.0, 0.5, t);
    float fallProgress = smoothstep(0.5, 3.5, t);

    float2 impactPoint = float2(sin(floor(iTime / cycleTime) * 2.3) * 0.2,
                                cos(floor(iTime / cycleTime) * 1.7) * 0.15);

    float scale = 8.0;
    float2 cellUv = uv * scale;
    float2 cellId = floor(cellUv);

    float minDist = 10.0;
    float secondDist = 10.0;
    float2 nearestId = float2(0.0);
    float2 nearestPoint = float2(0.0);

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            float2 neighbor = float2(float(x), float(y));
            float2 id = cellId + neighbor;
            float2 point = neighbor + voronoiShatterHash2(id) - fract(cellUv);
            float d = length(point);
            if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                nearestId = id;
                nearestPoint = point;
            } else if (d < secondDist) {
                secondDist = d;
            }
        }
    }

    float edge = secondDist - minDist;
    float edgeLine = smoothstep(0.05, 0.0, edge);

    float distFromImpact = length(nearestId / scale - impactPoint);
    float shardShatter = smoothstep(0.0, 0.8, shatterProgress - distFromImpact * 0.5);

    float2 shardHash = voronoiShatterHash2(nearestId + 100.0);
    float fallAngle = (shardHash.x - 0.5) * M_PI_F;
    float fallSpeed = 0.5 + shardHash.y * 1.5;
    float shardFall = fallProgress * fallSpeed * shardShatter;

    float crack = edgeLine * shatterProgress * smoothstep(0.8, 0.0, distFromImpact);

    float3 glassColor = float3(0.85, 0.9, 0.95);
    float reflection = pow(max(0.0, dot(normalize(float3(nearestPoint, 1.0)), float3(0.3, 0.5, 0.8))), 4.0);

    float3 behindColor = float3(0.1, 0.15, 0.2);
    behindColor += 0.1 * sin(uv.x * 10.0 + iTime) * float3(0.3, 0.5, 0.7);

    float opacity = max(1.0 - shardFall, 0.0);

    float3 shardColor = glassColor + reflection * 0.3;
    shardColor += crack * float3(0.8, 0.85, 1.0);

    float radialCrack = 0.0;
    for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5236;
        float2 dir = float2(cos(a), sin(a));
        float lineDist = abs(dot(uv - impactPoint, float2(-dir.y, dir.x)));
        float along = dot(uv - impactPoint, dir);
        radialCrack += smoothstep(0.003, 0.0, lineDist) * smoothstep(0.0, 0.4, along) * shatterProgress;
    }
    shardColor += radialCrack * float3(0.5, 0.6, 0.8) * 0.3;

    float3 col = mix(behindColor, shardColor, opacity);

    return float4(col, 1.0);
}
