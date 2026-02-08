#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float rustHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float rustNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(rustHash(i), rustHash(i+float2(1,0)), f.x),
               mix(rustHash(i+float2(0,1)), rustHash(i+float2(1,1)), f.x), f.y);
}

float rustFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * rustNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 rustCorrosionFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.05;
    
    float rust1 = rustFbm(uv * 5.0 + t);
    float rust2 = rustFbm(uv * 10.0 + float2(5.0, 3.0) + t * 0.5);
    float rust3 = rustFbm(uv * 20.0 + float2(10.0, 7.0));
    
    float corrosion = smoothstep(0.35, 0.5, rust1);
    float deepRust = smoothstep(0.55, 0.7, rust1 + rust2 * 0.3);
    
    float3 metal = float3(0.5, 0.52, 0.55);
    float3 lightRust = float3(0.7, 0.4, 0.15);
    float3 darkRust = float3(0.35, 0.15, 0.05);
    float3 veryDeep = float3(0.2, 0.08, 0.02);
    
    float3 col = metal;
    col = mix(col, lightRust, corrosion);
    col = mix(col, darkRust, deepRust);
    col = mix(col, veryDeep, smoothstep(0.7, 0.9, rust1 + rust3 * 0.2));
    
    float pitting = step(0.75, rust3) * corrosion * 0.15;
    col -= pitting;
    
    float metalSheen = pow(rustNoise(uv * 50.0), 4.0) * (1.0 - corrosion) * 0.2;
    col += metalSheen;
    
    return float4(col, 1.0);
}
