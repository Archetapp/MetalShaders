#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 gradientOrbFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float2 orbCenter = float2(sin(iTime * 0.5) * 0.1, cos(iTime * 0.7) * 0.08);
    float dist = length(uv - orbCenter);
    
    float core = exp(-dist * 8.0);
    float glow = exp(-dist * 3.0);
    float outer = exp(-dist * 1.5);
    
    float pulse = 0.9 + 0.1 * sin(iTime * 2.0);
    
    float3 coreColor = float3(1.0, 0.95, 0.9);
    float3 midColor = float3(0.4, 0.6, 1.0) * pulse;
    float3 outerColor = float3(0.6, 0.2, 0.8);
    
    float3 col = coreColor * core + midColor * glow * 0.7 + outerColor * outer * 0.3;
    col += float3(0.01, 0.01, 0.02);
    
    return float4(col, 1.0);
}
