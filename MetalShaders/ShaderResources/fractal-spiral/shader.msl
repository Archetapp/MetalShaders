#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 fracSpiralTransformMtl(float2 p, float scale, float angle) {
    float c = cos(angle), s = sin(angle);
    p = float2(c * p.x - s * p.y, s * p.x + c * p.y);
    return p * scale;
}

fragment float4 fractalSpiralFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.01, 0.04);

    float2 p = uv;
    float totalIntensity = 0.0;
    float hueAccum = 0.0;

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float r = length(p);
        float a = atan2(p.y, p.x);

        float spiral = sin(a * 3.0 - r * 10.0 + iTime * (1.0 + fi * 0.2));
        float band = smoothstep(-0.2, 0.2, spiral);

        float contribution = band * exp(-r * 2.0) / (1.0 + fi * 0.5);
        totalIntensity += contribution;
        hueAccum += fi * 0.5 + a;

        p = fracSpiralTransformMtl(p, 2.0, iTime * 0.3 + fi * 0.7);
        p = fract(p + 0.5) - 0.5;
    }

    float3 rainbow = 0.5 + 0.5 * cos(hueAccum * 0.3 + iTime * 0.5 + float3(0.0, 2.094, 4.189));
    col += rainbow * totalIntensity;

    float r = length(uv);
    float glow = exp(-r * 3.0) * 0.1;
    col += float3(0.2, 0.1, 0.3) * glow;

    return float4(col, 1.0);
}
