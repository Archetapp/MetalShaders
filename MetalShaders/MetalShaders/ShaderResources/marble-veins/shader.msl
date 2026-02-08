#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float marbleHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float marbleNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(marbleHash(i), marbleHash(i+float2(1,0)), f.x),
               mix(marbleHash(i+float2(0,1)), marbleHash(i+float2(1,1)), f.x), f.y);
}

float marbleFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 r = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * marbleNoise(p); p = r * p * 2.0; a *= 0.5; }
    return v;
}

fragment float4 marbleVeinsFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.05;
    
    float fbm1 = marbleFbm(uv * 6.0 + t);
    float fbm2 = marbleFbm(uv * 12.0 - t * 0.5);
    
    float vein = sin(uv.x * 10.0 + fbm1 * 8.0 + fbm2 * 4.0);
    vein = pow(abs(vein), 0.3);
    
    float3 white = float3(0.95, 0.93, 0.9);
    float3 gray = float3(0.6, 0.58, 0.55);
    float3 dark = float3(0.25, 0.22, 0.2);
    
    float3 col = mix(dark, gray, vein);
    col = mix(col, white, smoothstep(0.4, 0.8, vein));
    
    float fine = sin(uv.y * 60.0 + fbm1 * 20.0) * 0.02;
    col += fine;
    
    float polish = pow(marbleNoise(uv * 20.0), 3.0) * 0.1;
    col += polish;
    
    return float4(col, 1.0);
}
