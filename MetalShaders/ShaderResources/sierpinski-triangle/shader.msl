#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float sierpinskiDE(float2 p) {
    float scale = 1.0;
    
    for (int i = 0; i < 12; i++) {
        p = p * 2.0 - 1.0;
        
        if (p.x + p.y < 0.0) p.xy = -p.yx;
        if (p.x - p.y < 0.0) p.xy = float2(p.y, p.x);
        if (p.x < 0.0) p.x = -p.x;
        
        p = p - 1.0;
        scale *= 2.0;
    }
    
    return length(p) / scale;
}

fragment float4 sierpinskiTriangleFragment(VertexOut in [[stage_in]],
                                            constant float &iTime [[buffer(0)]],
                                            constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float rotation = iTime * 0.1;
    float2x2 rot = float2x2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    uv = rot * uv;
    
    uv = uv * 1.2 + float2(0.5, 0.35);
    
    float d = sierpinskiDE(uv);
    
    float edge = smoothstep(0.002, 0.0, d);
    float glow = exp(-d * 200.0);
    
    float3 col = float3(0.02, 0.02, 0.05);
    col += float3(0.2, 0.5, 0.9) * edge;
    col += float3(0.1, 0.3, 0.6) * glow * 0.5;
    
    float t = iTime * 0.3;
    col *= 0.8 + 0.2 * sin(d * 500.0 + t);
    
    return float4(col, 1.0);
}
