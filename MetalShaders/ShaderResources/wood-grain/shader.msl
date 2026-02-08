#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float woodHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float woodNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(woodHash(i), woodHash(i+float2(1,0)), f.x),
               mix(woodHash(i+float2(0,1)), woodHash(i+float2(1,1)), f.x), f.y);
}

float woodFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * woodNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 woodGrainFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.05;
    
    float2 center = float2(0.3, 0.5);
    float dist = length((uv - center) * float2(1.0, 3.0));
    
    float distortion = woodFbm(uv * 4.0 + t) * 0.5;
    float rings = sin((dist + distortion) * 40.0) * 0.5 + 0.5;
    rings = pow(rings, 0.7);
    
    float grain = woodNoise(float2(uv.x * 2.0, uv.y * 80.0 + t * 5.0)) * 0.08;
    
    float3 lightWood = float3(0.76, 0.6, 0.42);
    float3 darkWood = float3(0.45, 0.3, 0.15);
    float3 veryDark = float3(0.3, 0.18, 0.08);
    
    float3 col = mix(darkWood, lightWood, rings);
    col = mix(col, veryDark, (1.0 - rings) * 0.3);
    col += grain;
    
    float knot = smoothstep(0.08, 0.0, length(uv - float2(0.65, 0.35)));
    col = mix(col, veryDark, knot * 0.7);
    
    return float4(col, 1.0);
}
