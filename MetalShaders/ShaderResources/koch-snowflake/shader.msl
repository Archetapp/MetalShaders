#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float kochCurve(float2 p, int depth) {
    float s = 1.0;
    float k = 0.57735;
    
    p.x = abs(p.x);
    p.y += k;
    
    if (p.x + k * p.y > 0.0)
        p = float2(p.x - 0.5, p.y - k * 0.5);
    
    p.x -= 0.5;
    
    for (int i = 0; i < 8; i++) {
        if (i >= depth) break;
        p.x = abs(p.x);
        s *= 3.0;
        p *= 3.0;
        p.x -= 1.5;
        p.y -= k;
        if (p.x + k * p.y > 0.0)
            p = float2(p.x - 0.5, p.y - k * 0.5);
        p.x -= 0.5;
    }
    
    p.x += 0.5;
    return length(p - float2(clamp(p.x, 0.0, 1.0), 0.0)) / s;
}

fragment float4 kochSnowflakeFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float rotation = iTime * 0.15;
    float2x2 rot = float2x2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    uv = rot * uv;
    
    float scale = 1.5 + sin(iTime * 0.2) * 0.2;
    uv *= scale;
    
    float d1 = kochCurve(uv, 7);
    
    float2x2 rot120 = float2x2(cos(2.094), -sin(2.094), sin(2.094), cos(2.094));
    float d2 = kochCurve(rot120 * uv, 7);
    float d3 = kochCurve(rot120 * rot120 * uv, 7);
    
    float d = min(d1, min(d2, d3));
    
    float edge = smoothstep(0.003, 0.0, d);
    float glow = exp(-d * 300.0);
    
    float3 col = float3(0.02, 0.05, 0.1);
    col += float3(0.7, 0.85, 1.0) * edge;
    col += float3(0.3, 0.5, 0.8) * glow * 0.4;
    
    return float4(col, 1.0);
}
