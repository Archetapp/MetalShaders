#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashLt(float n) {
    return fract(sin(n) * 43758.5453);
}

float noiseLt(float x) {
    float i = floor(x);
    float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hashLt(i), hashLt(i + 1.0), f);
}

float bolt(float2 uv, float seed, float yStart, float yEnd, float xCenter, float spread) {
    float segments = 30.0;
    float minDist = 1e6;

    float2 prev = float2(xCenter, yStart);
    for (float i = 1.0; i <= segments; i++) {
        float t = i / segments;
        float y = mix(yStart, yEnd, t);
        float offset = (noiseLt(i * 3.7 + seed * 17.0) - 0.5) * spread;
        offset += (noiseLt(i * 7.3 + seed * 31.0) - 0.5) * spread * 0.5;
        float x = xCenter + offset * t;

        float2 curr = float2(x, y);

        float2 pa = uv - prev;
        float2 ba = curr - prev;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);
        minDist = min(minDist, d);

        prev = curr;
    }

    return minDist;
}

fragment float4 lightningFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;

    float t = iTime;
    float strikeRate = 1.5;
    float strikeT = fmod(t, strikeRate);
    float strikeId = floor(t / strikeRate);

    float intensity = exp(-strikeT * 4.0);
    float flash = exp(-strikeT * 8.0);

    float3 col = float3(0.02, 0.02, 0.06);
    col += float3(0.1, 0.1, 0.2) * flash * 0.5;

    float seed = strikeId * 7.0;
    float xOff = (hashLt(strikeId * 13.0) - 0.5) * 0.5;

    float d1 = bolt(uv, seed, 0.5, -0.5, xOff, 0.3);

    float core = (0.003 / (d1 + 0.003)) * intensity;
    float glow = (0.03 / (d1 + 0.03)) * intensity * 0.5;
    float bloom = (0.15 / (d1 + 0.15)) * intensity * 0.15;

    col += float3(0.7, 0.8, 1.0) * core;
    col += float3(0.4, 0.5, 1.0) * glow;
    col += float3(0.2, 0.2, 0.6) * bloom;

    if (hashLt(seed + 1.0) > 0.3) {
        float branchY = mix(0.5, -0.5, hashLt(seed + 2.0) * 0.6);
        float branchX = xOff + (hashLt(seed + 3.0) - 0.5) * 0.15;
        float d2 = bolt(uv, seed + 100.0, branchY, branchY - 0.3, branchX + 0.15, 0.15);
        float bc = (0.002 / (d2 + 0.002)) * intensity * 0.6;
        float bg = (0.02 / (d2 + 0.02)) * intensity * 0.3;
        col += float3(0.5, 0.6, 1.0) * bc;
        col += float3(0.2, 0.3, 0.7) * bg;
    }

    if (hashLt(seed + 5.0) > 0.5) {
        float branchY = mix(0.5, -0.5, hashLt(seed + 6.0) * 0.5 + 0.2);
        float branchX = xOff + (hashLt(seed + 7.0) - 0.5) * 0.1;
        float d3 = bolt(uv, seed + 200.0, branchY, branchY - 0.25, branchX - 0.12, 0.1);
        float bc2 = (0.002 / (d3 + 0.002)) * intensity * 0.4;
        col += float3(0.4, 0.5, 1.0) * bc2;
    }

    col = pow(col, float3(0.85));

    return float4(col, 1.0);
}
