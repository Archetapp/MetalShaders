#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 hypnoticSpiralFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float logR = log(r + 0.001);
    float spiral = sin(a * 3.0 - logR * 8.0 + iTime * 2.0);
    float bands = smoothstep(-0.1, 0.1, spiral);

    float3 col1 = mix(float3(0.1, 0.0, 0.3), float3(0.8, 0.2, 0.5), bands);
    float3 col2 = mix(float3(0.0, 0.1, 0.3), float3(0.2, 0.5, 0.9), bands);

    float hueShift = iTime * 0.5 + logR * 2.0;
    float3 rainbow = 0.5 + 0.5 * cos(hueShift + float3(0.0, 2.094, 4.189));

    col = mix(col1, col2, sin(iTime * 0.3) * 0.5 + 0.5);
    col = mix(col, rainbow, 0.3);

    float pulse = 0.8 + 0.2 * sin(r * 20.0 - iTime * 4.0);
    col *= pulse;

    float vignette = 1.0 - smoothstep(0.2, 0.6, r);
    col *= 0.5 + 0.5 * vignette;

    return float4(col, 1.0);
}
