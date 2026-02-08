#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float curlHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float curlNoiseFn(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(curlHash(i), curlHash(i+float2(1,0)), f.x),
               mix(curlHash(i+float2(0,1)), curlHash(i+float2(1,1)), f.x), f.y);
}

float curlFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * curlNoiseFn(p); p *= 2.0; a *= 0.5; }
    return v;
}

float2 curlField(float2 p) {
    float eps = 0.01;
    float dx = curlFbm(p + float2(eps, 0.0)) - curlFbm(p - float2(eps, 0.0));
    float dy = curlFbm(p + float2(0.0, eps)) - curlFbm(p - float2(0.0, eps));
    return float2(dy, -dx) / (2.0 * eps);
}

fragment float4 curlNoiseFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.2;
    
    float2 p = uv * 4.0;
    float2 curl = curlField(p + t);
    
    float streamline = sin(dot(curl, uv * 20.0) + t * 5.0) * 0.5 + 0.5;
    float flow = length(curl);
    
    float3 col1 = float3(0.05, 0.1, 0.2);
    float3 col2 = float3(0.2, 0.4, 0.7);
    float3 col3 = float3(0.8, 0.6, 0.3);
    
    float3 col = mix(col1, col2, streamline);
    col = mix(col, col3, flow * 0.5);
    col += pow(streamline, 4.0) * float3(0.3, 0.5, 0.7) * 0.3;
    
    return float4(col, 1.0);
}
