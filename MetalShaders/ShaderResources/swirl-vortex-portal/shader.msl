#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float swirlVortexHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 swirlVortexPortalFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));
    float2 vortexCenter = float2(sin(iTime * 0.3) * 0.1, cos(iTime * 0.2) * 0.1);
    float2 toCenter = uv - vortexCenter;
    float dist = length(toCenter);
    float angle = atan2(toCenter.y, toCenter.x);

    float swirlStrength = 3.0 * exp(-dist * 2.0);
    float swirlAngle = angle + swirlStrength - iTime * 1.5;

    float2 swirlUv = float2(cos(swirlAngle), sin(swirlAngle)) * dist;

    float spiralArms = sin(swirlAngle * 4.0 - dist * 15.0 + iTime * 2.0) * 0.5 + 0.5;
    spiralArms = pow(spiralArms, 2.0);

    float innerGlow = exp(-dist * 5.0);
    float eventHorizon = smoothstep(0.08, 0.05, dist);

    float ring1 = exp(-pow(dist - 0.15, 2.0) * 200.0);
    float ring2 = exp(-pow(dist - 0.25, 2.0) * 150.0);
    float ring3 = exp(-pow(dist - 0.4, 2.0) * 80.0);

    float3 portalColor1 = float3(0.2, 0.1, 0.5);
    float3 portalColor2 = float3(0.0, 0.4, 0.8);
    float3 portalColor3 = float3(0.1, 0.8, 0.6);

    float3 col = float3(0.02, 0.01, 0.05);
    col += spiralArms * mix(portalColor1, portalColor2, dist * 2.0) * (1.0 - eventHorizon);
    col += ring1 * portalColor3 * 0.8;
    col += ring2 * portalColor2 * 0.5;
    col += ring3 * portalColor1 * 0.3;
    col += innerGlow * float3(0.5, 0.3, 0.8) * 0.5;

    float stars = swirlVortexHash(floor(swirlUv * 30.0));
    stars = pow(stars, 25.0) * 3.0 * (1.0 - innerGlow);
    col += stars * float3(0.8, 0.9, 1.0);

    float3 portalInside = mix(float3(0.1, 0.0, 0.3), float3(0.3, 0.1, 0.5), sin(iTime * 2.0 + dist * 10.0) * 0.5 + 0.5);
    col = mix(col, portalInside, eventHorizon);

    float edgeDistort = exp(-pow(dist - 0.1, 2.0) * 50.0);
    col += edgeDistort * float3(0.4, 0.2, 0.8) * 0.4;

    col = pow(col, float3(0.85));
    return float4(col, 1.0);
}
