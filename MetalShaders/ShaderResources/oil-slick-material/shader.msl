#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float osNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}

fragment float4 oilSlickMaterialFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float3 water = float3(0.01, 0.02, 0.04);
    float wave = osNoise(uv*3.0+t*0.2)*0.5+osNoise(uv*7.0-t*0.3)*0.3;
    water += float3(0.0, 0.01, 0.03)*wave;
    float oilThickness = osNoise(uv*2.0+t*0.1);
    oilThickness += osNoise(uv*5.0-t*0.15)*0.5;
    oilThickness += osNoise(uv*11.0+t*0.05)*0.25;
    float swirl = sin(atan2(uv.y-0.5, uv.x-0.5)*3.0 + length(uv-0.5)*10.0 - t*0.5);
    oilThickness += swirl * 0.2;
    float phase = oilThickness * 8.0;
    float3 rainbow;
    rainbow.r = sin(phase)*0.5+0.5;
    rainbow.g = sin(phase+2.094)*0.5+0.5;
    rainbow.b = sin(phase+4.189)*0.5+0.5;
    rainbow *= rainbow;
    float oilMask = smoothstep(0.3, 0.5, osNoise(uv*1.5+t*0.05));
    float3 col = mix(water, rainbow*0.7, oilMask*0.8);
    float spec = pow(max(0.0, 1.0-length(uv-float2(0.5+0.2*sin(t*0.3), 0.5+0.2*cos(t*0.4)))*2.5), 8.0);
    col += float3(0.3)*spec*oilMask;
    col += water*0.3;
    return float4(col, 1.0);
}
