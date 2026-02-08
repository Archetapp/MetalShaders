#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float dragonDE(float2 p, float angle) {
    float s = 1.0;
    
    for (int i = 0; i < 16; i++) {
        float c = cos(0.7854 + angle * 0.01);
        float sn = sin(0.7854 + angle * 0.01);
        
        float2 p1 = float2(c * p.x + sn * p.y, -sn * p.x + c * p.y) * 1.4142;
        
        c = cos(-0.7854 + angle * 0.01);
        sn = sin(-0.7854 + angle * 0.01);
        float2 p2 = float2(c * (p.x - 1.0) + sn * p.y, -sn * (p.x - 1.0) + c * p.y) * 1.4142;
        
        float d1 = dot(p1, p1);
        float d2 = dot(p2, p2);
        
        p = (d1 < d2) ? p1 : p2;
        s *= 1.4142;
    }
    
    return length(p) / s;
}

fragment float4 dragonCurveFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    uv = uv * 2.5 + float2(0.5, 0.0);
    
    float d = dragonDE(uv, iTime * 0.1);
    
    float shape = smoothstep(0.005, 0.0, d);
    float glow = exp(-d * 100.0);
    
    float3 col = float3(0.02, 0.02, 0.04);
    
    float hue = d * 50.0 + iTime * 0.3;
    float3 rainbow = 0.5 + 0.5 * cos(6.28 * (hue + float3(0.0, 0.33, 0.67)));
    
    col += rainbow * shape;
    col += float3(0.2, 0.3, 0.5) * glow * 0.4;
    
    return float4(col, 1.0);
}
