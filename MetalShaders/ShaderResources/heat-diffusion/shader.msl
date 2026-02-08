#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hdNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);
}

fragment float4 heatDiffusionFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float heat = 0.0;
    for(int i=0;i<5;i++){
        float fi=float(i);
        float2 src=float2(0.2+fi*0.15, 0.3+0.2*sin(t*0.3+fi));
        float d=length(uv-src);
        float spread=0.1+0.08*sin(t*0.5+fi*1.2);
        heat += exp(-d*d/(2.0*spread*spread)) * (0.6+0.4*sin(t+fi));
    }
    heat += hdNoise(uv*5.0+t*0.2)*0.15;
    heat = clamp(heat, 0.0, 1.5);
    float3 cold = float3(0.0, 0.0, 0.3);
    float3 warm = float3(0.8, 0.2, 0.0);
    float3 hot = float3(1.0, 0.9, 0.2);
    float3 white = float3(1.0);
    float3 col;
    if(heat < 0.33) col = mix(cold, warm, heat*3.0);
    else if(heat < 0.66) col = mix(warm, hot, (heat-0.33)*3.0);
    else col = mix(hot, white, (heat-0.66)*3.0);
    float shimmer = hdNoise(uv*20.0+t*2.0)*0.1*heat;
    col += shimmer;
    return float4(col, 1.0);
}
