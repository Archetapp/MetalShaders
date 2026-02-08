#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 outrunRoadFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0);

    float horizonY = 0.0;

    if (uv.y > horizonY + 0.15) {
        float t = (uv.y - horizonY) / 0.5;
        col = mix(float3(1.0, 0.3, 0.5), float3(0.2, 0.0, 0.4), t);
    } else if (uv.y > horizonY) {
        float t = (uv.y - horizonY) / 0.15;
        col = mix(float3(1.0, 0.5, 0.2), float3(1.0, 0.3, 0.5), t);
    }

    float sunY = horizonY + 0.12;
    float sunDist = length(uv - float2(0.0, sunY));
    float sun = smoothstep(0.1, 0.09, sunDist);
    float sunBands = step(0.5, fract(uv.y * 30.0));
    sun *= 1.0 - sunBands * 0.3 * step(uv.y, sunY);
    col = mix(col, float3(1.0, 0.8, 0.2), sun);
    col += float3(1.0, 0.3, 0.1) * exp(-sunDist * 5.0) * 0.3;

    float mtX = uv.x;
    float mt1 = horizonY + 0.02 + 0.08 * exp(-mtX * mtX * 8.0) + 0.03 * sin(mtX * 8.0);
    float mt2 = horizonY + 0.01 + 0.06 * exp(-(mtX - 0.2) * (mtX - 0.2) * 6.0) + 0.02 * sin(mtX * 12.0);
    float mountain = max(step(uv.y, mt1), step(uv.y, mt2)) * step(horizonY, uv.y);
    col = mix(col, float3(0.15, 0.0, 0.2), mountain);

    if (uv.y < horizonY) {
        float depth = -0.3 / (uv.y - horizonY + 0.001);
        float roadX = uv.x;
        float roadWidth = 0.3 / depth;

        float isRoad = step(abs(roadX), roadWidth);

        float stripeZ = depth - iTime * 5.0;
        float stripes = step(0.5, fract(stripeZ * 0.3));
        float centerLine = step(abs(roadX), 0.005 / depth) * stripes;
        float edgeLine = smoothstep(0.003, 0.001, abs(abs(roadX) - roadWidth)) / depth * 2.0;

        float fade = exp((uv.y - horizonY) * 3.0);

        float3 groundCol = mix(float3(0.4, 0.1, 0.3), float3(0.2, 0.0, 0.15), stripes) * fade;
        float3 roadCol = float3(0.1, 0.05, 0.1) * fade;

        col = mix(groundCol, roadCol, isRoad);
        col += float3(1.0) * centerLine * fade;
        col += float3(1.0, 0.3, 0.5) * edgeLine * fade;

        float gridZ = smoothstep(0.02, 0.0, abs(fract(stripeZ * 0.15) - 0.5) - 0.48);
        col += float3(0.5, 0.1, 0.3) * gridZ * fade * (1.0 - isRoad) * 0.3;
    }

    return float4(col, 1.0);
}
