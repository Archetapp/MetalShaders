#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 seashellSpiralFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.uv * iResolution - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.03, 0.03, 0.05);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float growthRate = 0.12;
    float logSpiral = log(r + 0.001) / growthRate;
    float spiralAngle = a - logSpiral + iTime * 0.3;
    float spiralBand = sin(spiralAngle * 3.0) * 0.5 + 0.5;

    float shellMask = smoothstep(0.4, 0.35, r) * smoothstep(0.01, 0.03, r);

    float3 shellBase = mix(float3(0.85, 0.75, 0.6), float3(0.95, 0.85, 0.75), spiralBand);

    float ridges = sin(logSpiral * 40.0 + a * 2.0) * 0.5 + 0.5;
    shellBase *= 0.85 + 0.15 * ridges;

    float nacre = sin(a * 15.0 + r * 30.0 + iTime) * 0.5 + 0.5;
    float3 nacreCol = mix(float3(0.9, 0.85, 0.9), float3(0.8, 0.9, 0.95), nacre);
    shellBase = mix(shellBase, nacreCol, smoothstep(0.15, 0.05, r) * 0.6);

    float stripe = sin(a * 8.0 + logSpiral * 5.0) * 0.5 + 0.5;
    shellBase = mix(shellBase, float3(0.6, 0.3, 0.15), stripe * 0.3 * smoothstep(0.1, 0.3, r));

    float lip = smoothstep(0.36, 0.34, r) * smoothstep(0.32, 0.34, r);
    shellBase = mix(shellBase, float3(1.0, 0.9, 0.85), lip);

    col = mix(col, shellBase, shellMask);

    float glow = exp(-r * 4.0) * 0.1;
    col += float3(0.95, 0.9, 0.85) * glow;

    return float4(col, 1.0);
}
