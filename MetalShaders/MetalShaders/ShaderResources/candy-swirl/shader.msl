#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 candySwirlFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;
    
    float angle = atan2(uv.y, uv.x);
    float dist = length(uv);
    
    float swirl = angle + dist * 8.0 - t * 2.0;
    swirl += sin(dist * 10.0 - t * 3.0) * 0.5;
    
    float pattern = sin(swirl * 3.0) * 0.5 + 0.5;
    pattern = smoothstep(0.3, 0.7, pattern);
    
    float3 pink = float3(1.0, 0.3, 0.5);
    float3 blue = float3(0.3, 0.5, 1.0);
    float3 white = float3(1.0, 0.95, 0.98);
    
    float3 col = mix(pink, blue, pattern);
    float whiteStripe = pow(abs(sin(swirl * 6.0)), 12.0);
    col = mix(col, white, whiteStripe * 0.5);
    
    col *= 0.8 + 0.2 * (1.0 - dist);
    col += pow(max(0.0, 1.0 - dist * 2.0), 3.0) * float3(0.2);
    
    return float4(col, 1.0);
}
