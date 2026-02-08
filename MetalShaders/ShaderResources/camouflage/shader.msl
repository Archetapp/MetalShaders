#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float camoHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float camoNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(camoHash(i), camoHash(i+float2(1,0)), f.x),
               mix(camoHash(i+float2(0,1)), camoHash(i+float2(1,1)), f.x), f.y);
}

float camoFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * camoNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 camouflageFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.05;
    
    float n1 = camoFbm(uv * 4.0 + t);
    float n2 = camoFbm(uv * 3.0 + float2(5.0, 3.0) + t * 0.3);
    float n3 = camoFbm(uv * 5.0 + float2(10.0, 7.0) + t * 0.2);
    
    float3 darkGreen = float3(0.1, 0.2, 0.08);
    float3 olive = float3(0.3, 0.35, 0.15);
    float3 brown = float3(0.35, 0.25, 0.1);
    float3 tanColor = float3(0.55, 0.5, 0.35);
    
    float zone1 = smoothstep(0.3, 0.35, n1);
    float zone2 = smoothstep(0.45, 0.5, n2);
    float zone3 = smoothstep(0.55, 0.6, n3);
    
    float3 col = darkGreen;
    col = mix(col, olive, zone1);
    col = mix(col, brown, zone2);
    col = mix(col, tanColor, zone3 * 0.7);
    
    float tex = camoNoise(uv * 50.0) * 0.03;
    col += tex;
    
    return float4(col, 1.0);
}
