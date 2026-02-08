#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float frostCrystalHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 frostCrystalHash2(float2 p) {
    return float2(fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453),
                  fract(sin(dot(p, float2(269.5, 183.3))) * 43758.5453));
}

float frostCrystalNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = frostCrystalHash(i);
    float b = frostCrystalHash(i + float2(1.0, 0.0));
    float c = frostCrystalHash(i + float2(0.0, 1.0));
    float d = frostCrystalHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float frostCrystalFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * frostCrystalNoise(p);
        p = p * 2.0 + float2(100.0);
        a *= 0.5;
    }
    return v;
}

float3 frostCrystalVoronoi(float2 uv, float scale) {
    float2 id = floor(uv * scale);
    float2 gv = fract(uv * scale);

    float minDist = 1.0;
    float secondDist = 1.0;
    float2 closestId = float2(0.0);

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            float2 offset = float2(float(x), float(y));
            float2 cell = id + offset;
            float2 cellPos = frostCrystalHash2(cell) + offset;
            float d = length(gv - cellPos);

            if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                closestId = cell;
            } else if (d < secondDist) {
                secondDist = d;
            }
        }
    }

    return float3(minDist, secondDist, frostCrystalHash(closestId));
}

float frostCrystalBranch(float2 uv, float angle, float growthProgress) {
    float2 dir = float2(cos(angle), sin(angle));
    float2 perp = float2(-dir.y, dir.x);

    float along = dot(uv, dir);
    float across = abs(dot(uv, perp));

    float branchLen = growthProgress * 0.3;
    float branchWidth = 0.003 * (1.0 - along / branchLen);
    branchWidth = max(branchWidth, 0.0005);

    float branch = smoothstep(branchWidth + 0.001, branchWidth, across) *
                   step(0.0, along) * step(along, branchLen);

    for (int i = 1; i <= 4; i++) {
        float subPos = branchLen * float(i) / 5.0;
        if (along > subPos - 0.005 && along < subPos + 0.005 && growthProgress > 0.3) {
            float subGrowth = (growthProgress - 0.3) / 0.7;
            float subLen = subGrowth * 0.08;

            float subAngle = angle + 1.047;
            float2 subOrigin = dir * subPos;
            float2 subUv = uv - subOrigin;
            float2 subDir = float2(cos(subAngle), sin(subAngle));
            float2 subPerp = float2(-subDir.y, subDir.x);
            float subAlong = dot(subUv, subDir);
            float subAcross = abs(dot(subUv, subPerp));
            float subWidth = 0.002 * (1.0 - subAlong / subLen);
            subWidth = max(subWidth, 0.0003);
            branch += smoothstep(subWidth + 0.001, subWidth, subAcross) *
                      step(0.0, subAlong) * step(subAlong, subLen) * 0.7;

            subAngle = angle - 1.047;
            subDir = float2(cos(subAngle), sin(subAngle));
            subPerp = float2(-subDir.y, subDir.x);
            subAlong = dot(subUv, subDir);
            subAcross = abs(dot(subUv, subPerp));
            branch += smoothstep(subWidth + 0.001, subWidth, subAcross) *
                      step(0.0, subAlong) * step(subAlong, subLen) * 0.7;
        }
    }

    return min(branch, 1.0);
}

fragment float4 frostCrystallizationFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    float2 p = (uv - 0.5) * float2(aspect, 1.0);

    float growthTime = 10.0;
    float cycleProgress = fmod(iTime, growthTime) / growthTime;

    float3 bgColor = mix(float3(0.02, 0.04, 0.08), float3(0.05, 0.08, 0.15), uv.y);

    float surfaceFrost = frostCrystalFbm(uv * 8.0 + iTime * 0.01);
    float frostCoverage = smoothstep(1.0 - cycleProgress * 0.8, 1.0 - cycleProgress * 0.8 + 0.3, surfaceFrost);
    bgColor = mix(bgColor, float3(0.15, 0.2, 0.3), frostCoverage * 0.3);

    float3 vor = frostCrystalVoronoi(uv, 8.0);
    float edgeDist = vor.y - vor.x;
    float voronoiEdge = smoothstep(0.05, 0.0, edgeDist) * frostCoverage;
    bgColor += float3(0.2, 0.3, 0.5) * voronoiEdge * 0.5;

    float facetShading = vor.z * 0.15 * frostCoverage;
    bgColor += float3(0.1, 0.15, 0.25) * facetShading;

    float crystalAccum = 0.0;

    for (int s = 0; s < 5; s++) {
        float seedId = float(s);
        float2 seedPos = float2(
            (frostCrystalHash(float2(seedId * 1.3, 0.0)) - 0.5) * aspect * 0.8,
            (frostCrystalHash(float2(seedId * 2.7, 1.0)) - 0.5) * 0.8
        );

        float seedDelay = frostCrystalHash(float2(seedId, 2.0)) * 0.3;
        float localProgress = clamp((cycleProgress - seedDelay) / (1.0 - seedDelay), 0.0, 1.0);

        float2 relP = p - seedPos;

        float centerGlow = exp(-length(relP) * 20.0) * localProgress;
        crystalAccum += centerGlow * 0.5;

        for (int b = 0; b < 6; b++) {
            float branchAngle = float(b) * 1.0472;
            branchAngle += frostCrystalHash(float2(seedId, float(b))) * 0.2;
            float branchDelay = float(b) * 0.05;
            float branchProgress = clamp((localProgress - branchDelay) / (1.0 - branchDelay), 0.0, 1.0);
            crystalAccum += frostCrystalBranch(relP, branchAngle, branchProgress);
        }
    }

    crystalAccum = min(crystalAccum, 1.0);

    float3 crystalColor = mix(float3(0.6, 0.8, 1.0), float3(0.9, 0.95, 1.0), crystalAccum);

    float iceSpecular = pow(crystalAccum, 3.0) * 0.5;
    crystalColor += float3(1.0, 1.0, 0.95) * iceSpecular;

    float rimLight = pow(frostCrystalFbm(uv * 12.0 + iTime * 0.05), 3.0) * crystalAccum;
    crystalColor += float3(0.3, 0.5, 0.8) * rimLight;

    float3 col = mix(bgColor, crystalColor, crystalAccum);

    float sparkle = pow(frostCrystalHash(floor(uv * iResolution * 0.5)), 20.0) * crystalAccum * 3.0;
    sparkle *= 0.5 + 0.5 * sin(iTime * 5.0 + frostCrystalHash(floor(uv * 100.0)) * 6.28);
    col += float3(0.8, 0.9, 1.0) * sparkle;

    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    col *= smoothstep(0.0, 0.8, vignette);

    return float4(col, 1.0);
}
