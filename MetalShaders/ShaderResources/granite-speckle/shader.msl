#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float graniteHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float graniteNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(graniteHash(i), graniteHash(i+float2(1,0)), f.x),
               mix(graniteHash(i+float2(0,1)), graniteHash(i+float2(1,1)), f.x), f.y);
}

fragment float4 graniteSpeckleFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.03;
    
    float coarse = graniteNoise(uv * 8.0 + t);
    float medium = graniteNoise(uv * 25.0 + t * 0.5);
    float fine = graniteNoise(uv * 80.0);
    float vfine = graniteNoise(uv * 200.0);
    
    float speckle = step(0.7, fine) * 0.3 + step(0.8, vfine) * 0.2;
    
    float3 base = float3(0.55, 0.52, 0.5);
    float3 dark = float3(0.2, 0.18, 0.17);
    float3 light = float3(0.8, 0.78, 0.75);
    float3 mica = float3(0.7, 0.65, 0.55);
    
    float3 col = base;
    col = mix(col, dark, (1.0 - coarse) * 0.3);
    col = mix(col, light, medium * 0.2);
    col = mix(col, mica, speckle);
    
    float crystal = pow(graniteNoise(uv * 150.0 + t * 0.2), 8.0) * 0.15;
    col += crystal * float3(1.0, 0.95, 0.9);
    
    return float4(col, 1.0);
}
