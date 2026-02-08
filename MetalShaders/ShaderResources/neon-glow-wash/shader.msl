#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 neonGlowWashFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.4;
    
    float wave1 = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 2.5 + t * 1.3 + 1.0) * 0.5 + 0.5;
    float wave3 = sin((uv.x + uv.y) * 2.0 + t * 0.7 + 2.0) * 0.5 + 0.5;
    
    float3 neon1 = float3(1.0, 0.0, 0.6) * wave1;
    float3 neon2 = float3(0.0, 0.8, 1.0) * wave2;
    float3 neon3 = float3(0.5, 1.0, 0.0) * wave3;
    
    float3 col = neon1 + neon2 * 0.7 + neon3 * 0.5;
    col = pow(col, float3(0.8));
    
    float glow = 0.3 + 0.1 * sin(t * 2.0);
    col += glow * float3(0.1, 0.0, 0.15);
    
    col = clamp(col, 0.0, 1.0);
    
    return float4(col, 1.0);
}
