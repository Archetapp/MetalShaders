#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float2 perlinGrad(float2 p) {
    float a = fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453) * 6.28318;
    return float2(cos(a), sin(a));
}

float perlinNoise2D(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    float2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = dot(perlinGrad(i + float2(0,0)), f - float2(0,0));
    float b = dot(perlinGrad(i + float2(1,0)), f - float2(1,0));
    float c = dot(perlinGrad(i + float2(0,1)), f - float2(0,1));
    float d = dot(perlinGrad(i + float2(1,1)), f - float2(1,1));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}

float perlinFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * perlinNoise2D(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 perlinNoiseFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.2;
    
    float n = perlinFbm(uv * 5.0 + t);
    
    float3 col1 = float3(0.1, 0.15, 0.3);
    float3 col2 = float3(0.4, 0.6, 0.8);
    float3 col3 = float3(0.9, 0.85, 0.7);
    
    float3 col = n < 0.5 ? mix(col1, col2, n * 2.0) : mix(col2, col3, (n - 0.5) * 2.0);
    
    return float4(col, 1.0);
}
