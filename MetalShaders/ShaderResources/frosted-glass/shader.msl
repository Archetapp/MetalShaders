#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float frostHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float frostNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(frostHash(i), frostHash(i+float2(1,0)), f.x),
               mix(frostHash(i+float2(0,1)), frostHash(i+float2(1,1)), f.x), f.y);
}

float frostVoronoi(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    float md = 1.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        float2 n = float2(float(x), float(y));
        float2 r = n + frostHash(i + n) - f;
        md = min(md, dot(r, r));
    }
    return sqrt(md);
}

fragment float4 frostedGlassFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.2;
    
    float crystal = frostVoronoi(uv * 12.0 + t * 0.3);
    float detail = frostNoise(uv * 30.0 + t * 0.1) * 0.3;
    float frost = crystal + detail;
    
    float3 iceColor = float3(0.7, 0.85, 0.95);
    float3 deepIce = float3(0.4, 0.6, 0.8);
    float3 col = mix(deepIce, iceColor, frost);
    
    float highlight = pow(1.0 - crystal, 4.0) * 0.5;
    col += highlight * float3(1.0);
    
    float edge = smoothstep(0.0, 0.05, crystal) * (1.0 - smoothstep(0.05, 0.1, crystal));
    col += edge * float3(0.8, 0.9, 1.0) * 0.4;
    
    float refractVal = frostNoise(uv * 5.0 + t) * 0.03;
    col += refractVal * float3(0.5, 0.7, 1.0);
    
    return float4(col, 1.0);
}
