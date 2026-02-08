#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 cassetteTapeFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.15, 0.12, 0.1);

    float caseW = 0.4, caseH = 0.25;
    float caseMask = step(abs(uv.x), caseW) * step(abs(uv.y), caseH);
    col = mix(col, float3(0.2, 0.18, 0.15), caseMask);

    float border = step(abs(uv.x), caseW + 0.005) * step(abs(uv.y), caseH + 0.005) * (1.0 - caseMask);
    col = mix(col, float3(0.3, 0.25, 0.2), border);

    float2 reelL = float2(-0.18, 0.05);
    float2 reelR = float2(0.18, 0.05);
    float reelSize = 0.1;
    float hubSize = 0.03;

    float reelLDist = length(uv - reelL);
    float reelRDist = length(uv - reelR);

    float reelLMask = smoothstep(reelSize + 0.003, reelSize - 0.003, reelLDist);
    float reelRMask = smoothstep(reelSize + 0.003, reelSize - 0.003, reelRDist);

    float reelLAngle = atan2(uv.y - reelL.y, uv.x - reelL.x) + iTime * 3.0;
    float reelRAngle = atan2(uv.y - reelR.y, uv.x - reelR.x) + iTime * 3.0;

    float spokeL = step(0.7, fract(reelLAngle / (2.0 * M_PI_F) * 6.0));
    float spokeR = step(0.7, fract(reelRAngle / (2.0 * M_PI_F) * 6.0));

    float3 reelColL = float3(0.25, 0.2, 0.18) - spokeL * 0.05 * reelLMask;
    col = mix(col, reelColL, reelLMask);
    float3 reelColR = float3(0.25, 0.2, 0.18) - spokeR * 0.05 * reelRMask;
    col = mix(col, reelColR, reelRMask);

    float hubL = smoothstep(hubSize + 0.002, hubSize - 0.002, reelLDist);
    float hubR = smoothstep(hubSize + 0.002, hubSize - 0.002, reelRDist);
    col = mix(col, float3(0.5, 0.45, 0.4), max(hubL, hubR));

    float tapeY = 0.05;
    float tapeH = 0.008;
    float tapeMask = step(abs(uv.y - tapeY), tapeH) *
                     step(reelL.x + reelSize, uv.x) * step(uv.x, reelR.x - reelSize);
    col = mix(col, float3(0.15, 0.08, 0.05), tapeMask);
    col += tapeMask * float3(0.03) * (sin(uv.x * 100.0 - iTime * 20.0) * 0.5 + 0.5);

    float label = step(abs(uv.x), 0.3) * step(abs(uv.y + 0.1), 0.08) * caseMask;
    col = mix(col, float3(0.85, 0.82, 0.75), label);
    float labelLine = step(abs(fract((uv.y + 0.1 + 0.08) * 20.0) - 0.5), 0.45) * label;
    col -= float3(0.05) * labelLine;

    return float4(col, 1.0);
}
