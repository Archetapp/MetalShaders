#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float ridgedHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float ridgedNoiseFn(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(ridgedHash(i), ridgedHash(i+float2(1,0)), f.x),
               mix(ridgedHash(i+float2(0,1)), ridgedHash(i+float2(1,1)), f.x), f.y);
}

float ridgedMultifractal(float2 p) {
    float v = 0.0, a = 1.0, prev = 1.0;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        float n = 1.0 - abs(ridgedNoiseFn(p) * 2.0 - 1.0);
        n = n * n;
        v += n * a * prev;
        prev = n;
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v * 0.5;
}

fragment float4 ridgedNoiseFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.1;
    
    float ridged = ridgedMultifractal(uv * 5.0 + t);
    
    float3 deep = float3(0.05, 0.08, 0.15);
    float3 mid = float3(0.3, 0.25, 0.2);
    float3 peak = float3(0.95, 0.9, 0.85);
    float3 snow = float3(1.0);
    
    float3 col = mix(deep, mid, smoothstep(0.1, 0.3, ridged));
    col = mix(col, peak, smoothstep(0.3, 0.6, ridged));
    col = mix(col, snow, smoothstep(0.7, 0.9, ridged));
    
    return float4(col, 1.0);
}
