#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float turbHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float turbNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(turbHash(i), turbHash(i+float2(1,0)), f.x),
               mix(turbHash(i+float2(0,1)), turbHash(i+float2(1,1)), f.x), f.y);
}

float turbulenceFn(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 7; i++) {
        v += a * abs(turbNoise(p) * 2.0 - 1.0);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 turbulenceFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.2;
    
    float turb = turbulenceFn(uv * 5.0 + t);
    
    float3 col1 = float3(0.02, 0.05, 0.1);
    float3 col2 = float3(0.3, 0.15, 0.05);
    float3 col3 = float3(0.9, 0.7, 0.4);
    
    float3 col = mix(col1, col2, smoothstep(0.2, 0.5, turb));
    col = mix(col, col3, smoothstep(0.5, 0.9, turb));
    
    float crease = pow(1.0 - turb, 3.0) * 0.3;
    col += crease * float3(0.5, 0.6, 0.8);
    
    return float4(col, 1.0);
}
