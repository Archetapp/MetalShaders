#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float webHashMtl(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 spiderWebFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.uv * iResolution - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.02, 0.05);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float radialCount = 16.0;
    float radialAngle = fmod(a + M_PI_F, 2.0 * M_PI_F / radialCount);
    radialAngle = abs(radialAngle - M_PI_F / radialCount);
    float radialThread = smoothstep(0.003, 0.001, radialAngle * r);

    float spiralSpacing = 0.04;
    float spiralOffset = a / (2.0 * M_PI_F) * spiralSpacing;
    float spiralDist = fmod(r + spiralOffset + iTime * 0.01, spiralSpacing);
    spiralDist = abs(spiralDist - spiralSpacing * 0.5);
    float spiralThread = smoothstep(0.003, 0.001, spiralDist) * step(0.03, r) * step(r, 0.45);

    float web = max(radialThread * step(r, 0.45), spiralThread);
    col += float3(0.6, 0.6, 0.7) * web;

    for (int i = 0; i < 12; i++) {
        float fi = float(i);
        float dewAngle = webHashMtl(fi * 7.13) * 2.0 * M_PI_F;
        float dewR = 0.05 + webHashMtl(fi * 3.71) * 0.35;
        float2 dewPos = float2(cos(dewAngle), sin(dewAngle)) * dewR;
        float dewSize = 0.005 + 0.003 * webHashMtl(fi * 11.3);
        float dewDist = length(uv - dewPos);
        float dew = smoothstep(dewSize, dewSize * 0.3, dewDist);
        float sparkle = 0.5 + 0.5 * sin(iTime * 3.0 + fi * 2.0);
        col += dew * mix(float3(0.3, 0.4, 0.6), float3(1.0), sparkle * 0.5);
    }

    float vignette = 1.0 - smoothstep(0.3, 0.6, r);
    col *= 0.7 + 0.3 * vignette;

    return float4(col, 1.0);
}
