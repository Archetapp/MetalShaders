#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float valueHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float valueNoiseFn(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = valueHash(i);
    float b = valueHash(i + float2(1.0, 0.0));
    float c = valueHash(i + float2(0.0, 1.0));
    float d = valueHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float valueFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.866, 0.5, -0.5, 0.866);
    for (int i = 0; i < 7; i++) {
        v += a * valueNoiseFn(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 valueNoiseFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.15;
    
    float n = valueFbm(uv * 6.0 + t);
    
    float3 col = float3(n);
    col.r = valueFbm(uv * 6.0 + t + float2(1.7, 9.2));
    col.g = valueFbm(uv * 6.0 + t + float2(5.2, 1.3));
    col.b = valueFbm(uv * 6.0 + t + float2(2.8, 3.4));
    
    col = smoothstep(0.2, 0.8, col);
    
    return float4(col, 1.0);
}
