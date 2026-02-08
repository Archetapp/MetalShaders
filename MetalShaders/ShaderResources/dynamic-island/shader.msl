#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float diRoundedBox(float2 p, float2 b, float r) {
    float2 d = abs(p) - b + r;
    return length(max(d, 0.0)) - r + min(max(d.x, d.y), 0.0);
}

float diSmoothMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

fragment float4 dynamicIslandFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float cycle = fmod(t, 8.0);

    float separateToMerge = smoothstep(1.0, 3.0, cycle);
    float mergeToExpand = smoothstep(3.0, 4.0, cycle);
    float expandToContract = smoothstep(5.0, 6.0, cycle);
    float contractToSeparate = smoothstep(6.5, 7.8, cycle);

    float mergeFactor = separateToMerge * (1.0 - contractToSeparate);

    float spacing = mix(0.15, 0.0, mergeFactor);

    float expandWidth = mergeToExpand * (1.0 - expandToContract) * 0.12;

    float2 leftPos = float2(-spacing - 0.06, 0.0);
    float2 rightPos = float2(spacing + 0.06, 0.0);

    float leftRadius = 0.025 + expandWidth * 0.3;
    float rightRadius = 0.012 + expandWidth * 0.2;

    float2 leftSize = float2(0.06 + expandWidth, 0.025 + expandWidth * 0.3);
    float2 rightSize = float2(0.012 + expandWidth * 0.5, 0.012 + expandWidth * 0.2);

    float mergedWidth = 0.18 + expandWidth * 1.5;
    float mergedHeight = 0.028 + expandWidth * 0.4;
    float mergedRadius = 0.028 + expandWidth * 0.3;

    float d1 = diRoundedBox(uv - leftPos, leftSize, leftRadius);
    float d2 = diRoundedBox(uv - rightPos, rightSize, rightRadius);

    float smoothK = mix(0.01, 0.08, mergeFactor);
    float dSeparate = diSmoothMin(d1, d2, smoothK);

    float dMerged = diRoundedBox(uv, float2(mergedWidth, mergedHeight), mergedRadius);

    float d = mix(dSeparate, dMerged, smoothstep(0.5, 1.0, mergeFactor));

    float elastic = sin(cycle * 8.0) * exp(-cycle * 0.5) * 0.003 * mergeFactor;
    d += elastic;

    float shape = smoothstep(0.003, -0.003, d);

    float3 fillColor = float3(0.05, 0.05, 0.06);

    float edge = smoothstep(0.003, 0.0, abs(d));
    float3 edgeColor = float3(0.2, 0.2, 0.25);

    float innerGlow = exp(-max(0.0, -d) * 30.0) * shape;
    float3 innerGlowColor = float3(0.15, 0.15, 0.2);

    float ambient = smoothstep(0.02, -0.02, d) * 0.05;
    float3 ambientColor = float3(0.3, 0.3, 0.35);

    float pulse = sin(t * 3.0) * 0.5 + 0.5;
    float indicatorR = 0.004;
    float indicator1 = smoothstep(indicatorR, indicatorR - 0.002,
        length(uv - leftPos - float2(0.03, 0.0)));
    float indicator2 = smoothstep(indicatorR, indicatorR - 0.002,
        length(uv - rightPos));
    float3 indicatorColor = float3(0.2, 0.8, 0.3) * (0.7 + pulse * 0.3);

    float3 col = float3(0.92, 0.92, 0.93);

    float shadow = exp(-max(0.0, d) * 15.0) * 0.3;
    col -= shadow;

    col = mix(col, fillColor, shape);
    col += edgeColor * edge * 0.3;
    col += innerGlowColor * innerGlow * 0.3;
    col += ambientColor * ambient;

    col += indicatorColor * indicator1 * shape * (1.0 - mergeFactor * 0.5);
    col += indicatorColor * indicator2 * shape * (1.0 - mergeFactor * 0.5);

    float stretch = smoothstep(0.2, 0.8, mergeFactor) * (1.0 - smoothstep(0.8, 1.0, mergeFactor));
    float bridge = exp(-abs(uv.y) * 60.0) * exp(-abs(abs(uv.x) - spacing * 0.5) * 20.0);
    col -= bridge * stretch * 0.1 * shape;

    float reflection = smoothstep(-0.005, -0.015, d) * 0.1;
    col += reflection * float3(0.3, 0.3, 0.35) * (1.0 - uv.y * 5.0);

    return float4(col, 1.0);
}
