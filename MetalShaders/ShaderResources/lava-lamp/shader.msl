#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float lavaBlob(float2 uv, float2 center, float radius) {
    return radius / (length(uv - center) + 0.01);
}

fragment float4 lavaLampFragment(VertexOut in [[stage_in]],
                                  constant float &iTime [[buffer(0)]],
                                  constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime * 0.6;
    
    float field = 0.0;
    field += lavaBlob(uv, float2(sin(t*0.7)*0.15, sin(t*0.5)*0.3 + 0.1), 0.06);
    field += lavaBlob(uv, float2(cos(t*0.6)*0.2, cos(t*0.4)*0.25 - 0.1), 0.05);
    field += lavaBlob(uv, float2(sin(t*0.4+1.0)*0.1, sin(t*0.3+2.0)*0.35), 0.07);
    field += lavaBlob(uv, float2(cos(t*0.8+2.0)*0.18, cos(t*0.6+1.0)*0.2+0.15), 0.04);
    field += lavaBlob(uv, float2(sin(t*0.5+3.0)*0.12, sin(t*0.7+3.0)*0.3-0.2), 0.055);
    
    float blob = smoothstep(0.8, 1.5, field);
    
    float3 lavaHot = float3(1.0, 0.3, 0.05);
    float3 lavaWarm = float3(0.9, 0.1, 0.2);
    float3 lavaCool = float3(0.5, 0.05, 0.1);
    
    float3 lava = mix(lavaCool, lavaWarm, smoothstep(0.8, 1.2, field));
    lava = mix(lava, lavaHot, smoothstep(1.2, 2.0, field));
    
    float3 liquid = float3(0.15, 0.02, 0.05);
    float lampShape = smoothstep(0.35, 0.3, abs(uv.x)) * smoothstep(0.5, 0.45, abs(uv.y));
    
    float3 col = mix(liquid, lava, blob);
    col *= lampShape;
    col += (1.0 - lampShape) * float3(0.02, 0.01, 0.02);
    
    return float4(col, 1.0);
}
