#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 colorAfterimageFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float cycle = fmod(iTime, 8.0);
    float starePhase = smoothstep(0.0, 0.5, cycle) * smoothstep(5.0, 4.5, cycle);
    float revealPhase = smoothstep(5.0, 5.5, cycle) * smoothstep(8.0, 7.5, cycle);

    float3 stareColor = float3(0.0, 0.8, 0.8);
    float3 revealColor = float3(0.85);

    float circleR = 0.15;
    float circleMask = smoothstep(circleR + 0.005, circleR - 0.005, length(uv));

    float crossH = smoothstep(0.003, 0.001, abs(uv.y)) * step(abs(uv.x), 0.02);
    float crossV = smoothstep(0.003, 0.001, abs(uv.x)) * step(abs(uv.y), 0.02);
    float cross_ = max(crossH, crossV);

    float3 col = float3(0.5);

    if (starePhase > 0.01) {
        col = mix(col, stareColor, circleMask * starePhase);
        col = mix(col, float3(0.0), cross_ * starePhase);
        col += sin(iTime * 30.0) * 0.02 * starePhase;
    }

    if (revealPhase > 0.01) {
        col = mix(float3(0.5), revealColor, circleMask * revealPhase);
        col = mix(col, float3(0.3), cross_ * revealPhase);
        col += sin(length(uv) * 50.0) * 0.01 * revealPhase;
    }

    float border = smoothstep(0.48, 0.47, max(abs(uv.x), abs(uv.y) * iResolution.x / iResolution.y));
    col = mix(float3(0.2), col, border);

    return float4(col, 1.0);
}
