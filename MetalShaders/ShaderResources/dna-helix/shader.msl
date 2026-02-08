#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float dnaStrandMtl(float2 uv, float phase, float time) {
    float x = sin(uv.y * 8.0 + phase + time * 2.0) * 0.15;
    float d = abs(uv.x - x);
    float z = cos(uv.y * 8.0 + phase + time * 2.0);
    float width = 0.012 + 0.004 * (z * 0.5 + 0.5);
    return smoothstep(width, width * 0.3, d) * (0.6 + 0.4 * (z * 0.5 + 0.5));
}

fragment float4 dnaHelixFragment(VertexOut in [[stage_in]],
                                  constant float &iTime [[buffer(0)]],
                                  constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.02, 0.06);

    float strand1 = dnaStrandMtl(uv, 0.0, iTime);
    float strand2 = dnaStrandMtl(uv, M_PI_F, iTime);

    col += strand1 * float3(0.2, 0.5, 1.0);
    col += strand2 * float3(1.0, 0.3, 0.5);

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float y = -0.5 + fi * 0.05 + fmod(iTime * 0.1, 0.05);
        float phase1 = y * 8.0 + iTime * 2.0;
        float x1 = sin(phase1) * 0.15;
        float x2 = sin(phase1 + M_PI_F) * 0.15;
        float z = cos(phase1);

        float2 p1 = float2(x1, y);
        float2 p2 = float2(x2, y);
        float2 pa = uv - p1, ba = p2 - p1;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);
        float rung = smoothstep(0.005, 0.002, d) * (0.4 + 0.3 * (z * 0.5 + 0.5));

        float3 rungCol = mix(float3(0.2, 0.8, 0.3), float3(0.8, 0.6, 0.1), h);
        col += rung * rungCol;
    }

    float glow = exp(-length(uv) * 2.0) * 0.15;
    col += float3(0.1, 0.15, 0.3) * glow;

    return float4(col, 1.0);
}
