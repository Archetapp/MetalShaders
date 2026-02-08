#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float fernHash(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 barnsleyFernFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;
    
    float density = 0.0;
    float wind = sin(iTime * 0.5) * 0.02;
    
    float2 pt = float2(0.0);
    
    for (int i = 0; i < 200; i++) {
        float fi = float(i);
        float r = fernHash(fi * 13.37 + iTime * 0.01);
        
        float2 newPt;
        if (r < 0.01) {
            newPt = float2(0.0, 0.16 * pt.y);
        } else if (r < 0.86) {
            newPt = float2(0.85 * pt.x + 0.04 * pt.y + wind,
                          -0.04 * pt.x + 0.85 * pt.y + 1.6);
        } else if (r < 0.93) {
            newPt = float2(0.2 * pt.x - 0.26 * pt.y,
                           0.23 * pt.x + 0.22 * pt.y + 1.6);
        } else {
            newPt = float2(-0.15 * pt.x + 0.28 * pt.y,
                            0.26 * pt.x + 0.24 * pt.y + 0.44);
        }
        pt = newPt;
        
        float2 mapped = float2(pt.x * 0.18, pt.y * 0.09 - 0.45);
        float d = length(p - mapped);
        density += exp(-d * d * 800.0);
    }
    
    density = min(density, 1.0);
    
    float3 darkGreen = float3(0.05, 0.2, 0.05);
    float3 lightGreen = float3(0.2, 0.7, 0.15);
    float3 tip = float3(0.5, 0.9, 0.3);
    
    float3 col = mix(float3(0.02, 0.03, 0.05), darkGreen, density);
    col = mix(col, lightGreen, density * density);
    col = mix(col, tip, pow(density, 4.0));
    
    return float4(col, 1.0);
}
