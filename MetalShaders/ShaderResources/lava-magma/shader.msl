#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float magmaHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float magmaNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(magmaHash(i), magmaHash(i+float2(1,0)), f.x),
               mix(magmaHash(i+float2(0,1)), magmaHash(i+float2(1,1)), f.x), f.y);
}

float magmaFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 r = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * magmaNoise(p); p = r * p * 2.0; a *= 0.5; }
    return v;
}

float3 magmaPalette(float t) {
    t = clamp(t, 0.0, 1.0);
    float3 cold = float3(0.1, 0.02, 0.0);
    float3 warm = float3(0.6, 0.1, 0.0);
    float3 hot = float3(1.0, 0.5, 0.0);
    float3 white = float3(1.0, 0.9, 0.5);
    
    if (t < 0.33) return mix(cold, warm, t * 3.0);
    if (t < 0.66) return mix(warm, hot, (t - 0.33) * 3.0);
    return mix(hot, white, (t - 0.66) * 3.0);
}

fragment float4 lavaMagmaFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.15;
    
    float2 flow = float2(magmaFbm(uv * 3.0 + t), magmaFbm(uv * 3.0 + t + float2(5.0, 3.0)));
    float heat = magmaFbm(uv * 4.0 + flow * 0.5 + t * 0.5);
    heat = pow(heat, 1.5);
    
    float3 col = magmaPalette(heat);
    
    float crack = smoothstep(0.01, 0.0, abs(heat - 0.3)) + smoothstep(0.01, 0.0, abs(heat - 0.5));
    col += crack * float3(1.0, 0.6, 0.1) * 0.5;
    
    float glow = max(0.0, heat - 0.5) * 2.0;
    col += glow * float3(0.3, 0.1, 0.0) * 0.3;
    
    return float4(col, 1.0);
}
