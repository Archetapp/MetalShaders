#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float frostedWipeHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float frostedWipeNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(frostedWipeHash(i), frostedWipeHash(i + float2(1, 0)), f.x),
               mix(frostedWipeHash(i + float2(0, 1)), frostedWipeHash(i + float2(1, 1)), f.x), f.y);
}

float frostedWipeFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * frostedWipeNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 frostedGlassWipeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float2 wipePos = float2(sin(iTime * 0.4) * 0.4, cos(iTime * 0.3) * 0.3);
    float wipeDist = length(centered - wipePos);

    float wipeRadius = 0.3 + 0.1 * sin(iTime * 0.5);
    float clearMask = smoothstep(wipeRadius, wipeRadius - 0.15, wipeDist);

    float3 sharpContent = float3(0.0);
    float checker = step(0.5, fract(centered.x * 3.0)) * step(0.5, fract(centered.y * 3.0)) +
                    step(0.5, fract(centered.x * 3.0 + 0.5)) * step(0.5, fract(centered.y * 3.0 + 0.5));
    sharpContent = mix(float3(0.2, 0.4, 0.6), float3(0.6, 0.3, 0.2), checker);
    float circle = smoothstep(0.32, 0.3, length(centered));
    sharpContent = mix(sharpContent, float3(0.8, 0.6, 0.2), circle);

    float frostNoise = frostedWipeFbm(uv * 8.0);
    float frostDetail = frostedWipeFbm(uv * 20.0) * 0.5 + frostedWipeFbm(uv * 40.0) * 0.25;
    float2 frostOffset = float2(frostNoise, frostDetail) * 0.03;
    float3 blurredContent = float3(0.0);
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 0.785;
        float2 offset = float2(cos(angle), sin(angle)) * 0.02 * (1.0 + frostNoise);
        float2 sampleUv = centered + offset + frostOffset;
        float c = step(0.5, fract(sampleUv.x * 3.0)) * step(0.5, fract(sampleUv.y * 3.0)) +
                  step(0.5, fract(sampleUv.x * 3.0 + 0.5)) * step(0.5, fract(sampleUv.y * 3.0 + 0.5));
        blurredContent += mix(float3(0.2, 0.4, 0.6), float3(0.6, 0.3, 0.2), c);
    }
    blurredContent /= 8.0;

    float3 frostColor = blurredContent * 0.5 + float3(0.7, 0.75, 0.8) * 0.5;
    frostColor += frostDetail * 0.15;
    float droplets = pow(frostedWipeNoise(uv * 50.0), 8.0) * 0.3;
    frostColor += droplets;

    float3 col = mix(frostColor, sharpContent, clearMask);

    float edgeGlow = smoothstep(wipeRadius - 0.15, wipeRadius - 0.05, wipeDist) *
                     smoothstep(wipeRadius + 0.05, wipeRadius, wipeDist);
    col += edgeGlow * float3(0.2, 0.25, 0.3) * 0.5;

    return float4(col, 1.0);
}
