#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float fmNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 frostedMetalFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float3 baseCol=float3(0.6,0.62,0.65);
    float brush=fmNoise(float2(uv.x*200.0,uv.y*5.0))*0.03;
    float brush2=fmNoise(float2(uv.x*400.0,uv.y*3.0))*0.015;
    float3 col=baseCol+brush+brush2;
    float2 lp=float2(0.5+0.3*sin(t*0.4),0.5+0.3*cos(t*0.3));
    float ld=length(uv-lp);
    col+=float3(0.8,0.82,0.85)*exp(-ld*ld*4.0)*0.15;
    float brushSpec=fmNoise(float2(uv.x*300.0+t*0.1,uv.y*4.0));
    col+=float3(0.9)*pow(brushSpec,3.0)*exp(-ld*4.0)*0.2;
    col+=fmNoise(uv*30.0)*0.02;
    col*=1.0-length(uv-0.5)*0.5;
    return float4(col,1.0);}
