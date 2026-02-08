#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bloomPetalMtl(float2 p, float angle, float size) {
    float c = cos(angle), s = sin(angle);
    p = float2(c * p.x - s * p.y, s * p.x + c * p.y);
    float d = length(p * float2(1.0, 2.5)) - size;
    return smoothstep(0.01, -0.01, d);
}

fragment float4 flowerBloomFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.05, 0.02);

    float goldenAngle = 2.39996;
    float bloomTime = fmod(iTime * 0.5, 6.0);
    int numPetals = int(clamp(bloomTime * 12.0, 0.0, 60.0));

    for (int i = 0; i < 60; i++) {
        if (i >= numPetals) break;
        float fi = float(i);
        float angle = fi * goldenAngle;
        float dist = 0.03 * sqrt(fi);
        float petalGrowth = clamp(bloomTime * 12.0 - fi, 0.0, 1.0);

        float2 center = float2(cos(angle), sin(angle)) * dist;
        float size = (0.025 + 0.015 * sin(fi * 0.5)) * petalGrowth;
        float petal = bloomPetalMtl(uv - center, angle + 1.5708, size);

        float hue = fmod(fi * goldenAngle * 0.5, 6.2832);
        float3 petalCol = 0.5 + 0.5 * cos(hue + float3(0.0, 2.094, 4.189));
        petalCol = mix(petalCol, float3(1.0, 0.4, 0.6), 0.4);

        col = mix(col, petalCol, petal * 0.9);
    }

    float centerDot = smoothstep(0.03, 0.01, length(uv));
    col = mix(col, float3(1.0, 0.85, 0.2), centerDot);

    return float4(col, 1.0);
}
