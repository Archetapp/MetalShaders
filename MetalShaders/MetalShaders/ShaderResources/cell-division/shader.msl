#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float cellDivNoise(float2 p) {
    return fract(sin(dot(p, float2(41.1, 289.7))) * 43758.5453);
}

fragment float4 cellDivisionFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.01, 0.02, 0.04);

    float phase = fmod(iTime * 0.4, 2.0 * M_PI_F);
    float split = smoothstep(0.0, M_PI_F, phase);

    float sep = split * 0.2;
    float2 c1 = float2(-sep, 0.0);
    float2 c2 = float2(sep, 0.0);

    float cellSize1 = 0.25 - split * 0.05;
    float pinch = 1.0 - 0.4 * sin(split * M_PI_F);
    float membraneWidth = 0.008;

    float d1 = length((uv - c1) * float2(1.0, 1.0 / pinch)) - cellSize1;
    float d2 = length((uv - c2) * float2(1.0, 1.0 / pinch)) - cellSize1;
    float cellDist = min(d1, d2);

    float membrane = smoothstep(membraneWidth, 0.0, abs(cellDist));
    col += membrane * float3(0.3, 0.7, 0.4);

    float inside = smoothstep(0.01, -0.01, cellDist);
    col = mix(col, float3(0.08, 0.15, 0.12), inside * 0.8);

    float nucSize = 0.08 * (1.0 - split * 0.3);
    float nuc1 = smoothstep(nucSize + 0.005, nucSize - 0.005, length(uv - c1));
    float nuc2 = smoothstep(nucSize + 0.005, nucSize - 0.005, length(uv - c2));
    col = mix(col, float3(0.2, 0.3, 0.6), max(nuc1, nuc2) * inside);

    if (split > 0.1 && split < 0.9) {
        for (int i = 0; i < 10; i++) {
            float fi = float(i);
            float angle = fi * 0.628 + iTime;
            float2 fiberStart = c1 + float2(cos(angle), sin(angle)) * nucSize;
            float2 fiberEnd = c2 + float2(cos(angle + M_PI_F), sin(angle + M_PI_F)) * nucSize;
            float2 pa = uv - fiberStart, ba = fiberEnd - fiberStart;
            float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
            float d = length(pa - ba * h);
            float fiber = smoothstep(0.003, 0.001, d) * inside;
            col += fiber * float3(0.4, 0.5, 0.2) * 0.3;
        }
    }

    for (int i = 0; i < 15; i++) {
        float fi = float(i);
        float2 orgPos = float2(cellDivNoise(float2(fi, 0.0)) - 0.5, cellDivNoise(float2(0.0, fi)) - 0.5) * 0.35;
        float side = orgPos.x > 0.0 ? 1.0 : -1.0;
        orgPos.x += side * sep * split;
        float orgSize = 0.008 + 0.005 * cellDivNoise(float2(fi, fi));
        float org = smoothstep(orgSize, orgSize * 0.3, length(uv - orgPos));
        col += org * float3(0.3, 0.2, 0.1) * inside * 0.5;
    }

    return float4(col, 1.0);
}
