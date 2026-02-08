#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 pulsingGridFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.05, 0.05, 0.08);

    float gridSize = 0.06;
    float2 gridID = floor(uv / gridSize);
    float2 gridUV = fract(uv / gridSize) - 0.5;

    float distFromCenter = length(gridID * gridSize);
    float wave1 = sin(distFromCenter * 15.0 - iTime * 3.0) * 0.5 + 0.5;
    float wave2 = sin(gridID.x * 2.0 + gridID.y * 2.0 - iTime * 2.0) * 0.5 + 0.5;
    float wave = mix(wave1, wave2, sin(iTime * 0.3) * 0.5 + 0.5);

    float radius = 0.15 + 0.3 * wave;
    float circle = smoothstep(radius + 0.05, radius - 0.05, length(gridUV));

    float3 circleCol = 0.5 + 0.5 * cos(distFromCenter * 5.0 + iTime + float3(0.0, 2.094, 4.189));
    circleCol *= 0.5 + 0.5 * wave;

    col = mix(col, circleCol, circle);

    float glow = exp(-length(gridUV) * 4.0) * wave * 0.2;
    col += circleCol * glow;

    return float4(col, 1.0);
}
