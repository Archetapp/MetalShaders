#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 nlpTrailPos(float t, float seed) {
    float s1 = seed * 6.28;
    float s2 = seed * 4.17;
    return float2(
        sin(t * 0.7 + s1) * 0.3 + sin(t * 1.3 + s2) * 0.15 + cos(t * 0.4 + seed) * 0.1,
        cos(t * 0.9 + s1) * 0.25 + sin(t * 1.7 + s2) * 0.12 + sin(t * 0.3 + seed) * 0.08
    );
}

float3 nlpTrailColor(float seed) {
    float h = fract(seed * 3.7);
    float3 col;
    if (h < 0.166) col = float3(1.0, 0.1, 0.3);
    else if (h < 0.333) col = float3(0.1, 0.5, 1.0);
    else if (h < 0.5) col = float3(0.1, 1.0, 0.4);
    else if (h < 0.666) col = float3(1.0, 0.4, 0.9);
    else if (h < 0.833) col = float3(1.0, 0.7, 0.1);
    else col = float3(0.3, 0.9, 1.0);
    return col;
}

fragment float4 neonLightPaintingFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float3 col = float3(0.01, 0.01, 0.02);

    float trailCount = 5.0;

    for (float trail = 0.0; trail < 5.0; trail++) {
        float seed = trail / trailCount;
        float3 trailCol = nlpTrailColor(seed);

        float trailLength = 80.0;
        float stepSize = 0.025;

        for (float i = 0.0; i < 80.0; i++) {
            float sampleTime = t - i * stepSize;
            float2 pos = nlpTrailPos(sampleTime, seed);

            float dist = length(uv - pos);
            float age = i / trailLength;
            float fade = exp(-age * 3.0);

            float core = 0.001 / (dist * dist + 0.0001) * fade;
            col += trailCol * core * 0.008;

            float glow = exp(-dist * dist * 150.0) * fade;
            col += trailCol * glow * 0.06;

            float outerGlow = exp(-dist * dist * 20.0) * fade;
            col += trailCol * outerGlow * 0.01;
        }

        float2 headPos = nlpTrailPos(t, seed);
        float headDist = length(uv - headPos);
        float headGlow = 0.003 / (headDist * headDist + 0.0001);
        col += trailCol * headGlow * 0.05;
        col += float3(1.0) * exp(-headDist * headDist * 500.0) * 0.5;
    }

    col += float3(0.02, 0.01, 0.03) * (1.0 - length(uv));

    col = 1.0 - exp(-col * 2.0);

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
