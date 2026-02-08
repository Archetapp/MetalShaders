#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float duotoneNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = fract(sin(dot(i, float2(127.1,311.7))) * 43758.5453);
    float b = fract(sin(dot(i+float2(1,0), float2(127.1,311.7))) * 43758.5453);
    float c = fract(sin(dot(i+float2(0,1), float2(127.1,311.7))) * 43758.5453);
    float d = fract(sin(dot(i+float2(1,1), float2(127.1,311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float duotoneFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * duotoneNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 duotoneWashFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.3;
    
    float boundary = uv.x * 0.6 + uv.y * 0.4;
    boundary += duotoneFbm(uv * 3.0 + t) * 0.3;
    boundary += sin(uv.y * 5.0 + t * 2.0) * 0.05;
    
    float3 color1 = float3(0.05, 0.05, 0.2);
    float3 color2 = float3(0.95, 0.4, 0.2);
    
    float blend = smoothstep(0.35, 0.65, boundary);
    float3 col = mix(color1, color2, blend);
    
    float grain = duotoneNoise(uv * 200.0 + t * 10.0) * 0.03;
    col += grain;
    
    return float4(col, 1.0);
}
