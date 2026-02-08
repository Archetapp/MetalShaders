#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bflyHashMtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float bflyWingShapeMtl(float2 p) {
    float a = atan2(p.y, p.x);
    float r = length(p);
    float wing = 0.25 * (1.0 + 0.3 * cos(a * 2.0)) * (sin(a) * 0.5 + 0.7);
    return smoothstep(0.01, -0.01, r - wing) * step(0.0, p.y * 0.5 + abs(p.x));
}

fragment float4 butterflyWingsFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.03, 0.03, 0.05);

    float flapAngle = sin(iTime * 3.0) * 0.3;
    float2 uvR = float2(abs(uv.x), uv.y);
    uvR.x *= 1.0 + flapAngle * 0.5;

    float wing = bflyWingShapeMtl(uvR);

    float3 wingCol = float3(0.9, 0.3, 0.1);
    float pattern1 = smoothstep(0.15, 0.14, length(uvR - float2(0.12, 0.08)));
    float pattern2 = smoothstep(0.08, 0.07, length(uvR - float2(0.06, -0.05)));
    wingCol = mix(wingCol, float3(0.1, 0.1, 0.3), pattern1);
    wingCol = mix(wingCol, float3(0.0, 0.0, 0.2), pattern2);

    float scales = bflyHashMtl(floor(uvR * 80.0));
    wingCol *= 0.85 + 0.15 * scales;

    float iridescence = 0.5 + 0.5 * sin(uvR.x * 30.0 + uvR.y * 20.0 + iTime);
    wingCol += float3(0.05, 0.0, 0.1) * iridescence;

    float edgeDark = smoothstep(0.2, 0.22, length(uvR) * (0.8 + 0.2 * sin(atan2(uvR.y, uvR.x) * 5.0)));
    wingCol = mix(wingCol, float3(0.05, 0.02, 0.02), edgeDark * 0.5);

    col = mix(col, wingCol, wing);

    float body = smoothstep(0.015, 0.005, abs(uv.x)) * smoothstep(0.2, 0.0, abs(uv.y - 0.02));
    col = mix(col, float3(0.15, 0.1, 0.05), body);

    float ant1 = smoothstep(0.003, 0.001, abs(uv.x - 0.02 - uv.y * 0.3)) * step(0.05, uv.y) * step(uv.y, 0.2);
    float ant2 = smoothstep(0.003, 0.001, abs(uv.x + 0.02 + uv.y * 0.3)) * step(0.05, uv.y) * step(uv.y, 0.2);
    col += (ant1 + ant2) * float3(0.2, 0.15, 0.1);

    return float4(col, 1.0);
}
