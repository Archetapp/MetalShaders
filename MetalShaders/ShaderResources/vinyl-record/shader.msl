#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 vinylRecordFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.1, 0.08, 0.06);

    float r = length(uv);
    float a = atan2(uv.y, uv.x) + iTime * 2.0;

    float discMask = smoothstep(0.4, 0.395, r) * smoothstep(0.015, 0.02, r);

    float grooves = sin(r * 500.0 + a * 0.5) * 0.5 + 0.5;
    grooves *= smoothstep(0.04, 0.05, r) * smoothstep(0.4, 0.38, r);

    float lightAngle = a + r * 2.0;
    float reflection = pow(max(sin(lightAngle), 0.0), 8.0);
    float3 grooveCol = mix(float3(0.02, 0.02, 0.03), float3(0.04, 0.04, 0.05), grooves);
    grooveCol += float3(0.08, 0.06, 0.1) * reflection;

    float rainbow = sin(lightAngle * 3.0) * 0.5 + 0.5;
    grooveCol += 0.03 * (0.5 + 0.5 * cos(rainbow * 2.0 * M_PI_F + float3(0.0, 2.094, 4.189)));

    col = mix(col, grooveCol, discMask);

    float labelR = 0.12;
    float labelMask = smoothstep(labelR + 0.003, labelR - 0.003, r);
    float3 labelCol = float3(0.8, 0.2, 0.15);
    float labelRing = smoothstep(0.002, 0.0, abs(r - 0.08));
    labelCol = mix(labelCol, float3(0.9, 0.85, 0.7), labelRing);
    col = mix(col, labelCol, labelMask);

    float holeMask = smoothstep(0.012, 0.008, r);
    col = mix(col, float3(0.1, 0.08, 0.06), holeMask);

    float highlight = exp(-pow(r - 0.25, 2.0) * 200.0) * pow(max(sin(a + 1.0), 0.0), 4.0);
    col += float3(0.1, 0.08, 0.12) * highlight * discMask;

    return float4(col, 1.0);
}
