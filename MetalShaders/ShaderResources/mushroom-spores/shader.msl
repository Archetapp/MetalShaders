#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float sporeHashMtl(float n) { return fract(sin(n) * 43758.5453); }
float sporeHash2Mtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

fragment float4 mushroomSporesFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.03, 0.02);

    float2 capCenter = float2(0.0, -0.05);
    float capR = length(uv - capCenter);
    float capA = atan2(uv.y - capCenter.y, uv.x - capCenter.x);
    float capShape = 0.15 * (1.0 + 0.1 * sin(capA * 8.0));
    float cap = smoothstep(capShape, capShape - 0.01, capR) * step(capCenter.y - 0.02, uv.y);
    float3 capCol = mix(float3(0.5, 0.2, 0.1), float3(0.7, 0.35, 0.15), (uv.y - capCenter.y) * 3.0);
    float spots = sporeHash2Mtl(floor(uv * 30.0));
    capCol = mix(capCol, float3(0.9, 0.8, 0.6), step(0.85, spots) * cap);
    col = mix(col, capCol, cap);

    float stem = smoothstep(0.03, 0.02, abs(uv.x)) * step(-0.3, uv.y) * step(uv.y, capCenter.y);
    col = mix(col, float3(0.6, 0.55, 0.45), stem);

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float seed = sporeHashMtl(fi * 13.37);
        float birthTime = seed * 4.0;
        float age = fmod(iTime - birthTime, 4.0);

        float angle = sporeHashMtl(fi * 7.13) * 2.0 * M_PI_F;
        float speed = 0.02 + sporeHashMtl(fi * 3.71) * 0.03;
        float drift = sporeHashMtl(fi * 11.3) - 0.5;

        float2 sporePos = capCenter + float2(0.0, 0.1);
        sporePos.x += sin(angle) * speed * age + drift * 0.05 * sin(iTime + fi);
        sporePos.y += cos(angle) * speed * age * 0.5 + age * 0.04;
        sporePos.x += sin(iTime * 2.0 + fi) * 0.01 * age;

        float sporeSize = 0.003 * (1.0 - age / 4.0);
        float sporeDist = length(uv - sporePos);
        float spore = smoothstep(sporeSize, sporeSize * 0.2, sporeDist);

        float alpha = smoothstep(4.0, 2.0, age) * smoothstep(0.0, 0.3, age);
        col += spore * float3(0.6, 0.5, 0.3) * alpha * 0.8;
        col += exp(-sporeDist * 200.0) * float3(0.3, 0.25, 0.15) * alpha * 0.3;
    }

    return float4(col, 1.0);
}
