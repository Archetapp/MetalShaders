#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 tronGridscapeFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0, 0.0, 0.02);

    if (uv.y < 0.0) {
        float perspective = -0.3 / uv.y;
        float gridX = uv.x * perspective;
        float gridZ = perspective - iTime * 2.0;

        float lineX = smoothstep(0.05, 0.0, abs(fract(gridX) - 0.5) - 0.47);
        float lineZ = smoothstep(0.05, 0.0, abs(fract(gridZ * 0.5) - 0.5) - 0.47);
        float grid = max(lineX, lineZ);

        float fade = exp(uv.y * 5.0);
        float3 gridCol = float3(0.0, 0.5, 1.0) * grid * fade;

        float pulse = 0.5 + 0.5 * sin(gridZ * 3.0 - iTime * 4.0);
        gridCol += float3(0.0, 0.2, 0.5) * grid * pulse * fade * 0.5;

        col += gridCol;

        float horizon = exp(-abs(uv.y) * 50.0);
        col += float3(0.0, 0.3, 0.8) * horizon;
    } else {
        float skyGlow = exp(-uv.y * 3.0);
        col += float3(0.0, 0.05, 0.15) * skyGlow;

        for (int i = 0; i < 30; i++) {
            float fi = float(i);
            float2 sp = float2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) * 0.4 + 0.05);
            float d = length(uv - sp);
            col += exp(-d * d * 5000.0) * float3(0.3, 0.5, 0.8) * 0.5;
        }
    }

    float centerGlow = exp(-abs(uv.x) * 8.0) * exp(-abs(uv.y + 0.02) * 20.0);
    col += float3(0.0, 0.4, 1.0) * centerGlow * 0.5;

    return float4(col, 1.0);
}
