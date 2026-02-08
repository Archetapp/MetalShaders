#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float cpWave(float2 p,float2 center,float t,float freq,float speed){
    float d=length(p-center);
    return sin(d*freq-t*speed)*exp(-d*2.0)*0.5;
}

fragment float4 calmPoolFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float h=0.0;
    h+=cpWave(uv,float2(0.2,0.1),t,25.0,4.0);
    h+=cpWave(uv,float2(-0.3,-0.15),t*0.8,20.0,3.0);
    h+=cpWave(uv,float2(0.0,0.3),t*1.2,30.0,5.0);
    h+=cpWave(uv,float2(-0.15,0.0),t*0.6,22.0,3.5)*0.7;
    float2 dx=float2(0.001,0.0);
    float2 dy=float2(0.0,0.001);
    float hx=cpWave(uv+dx,float2(0.2,0.1),t,25.0,4.0)+cpWave(uv+dx,float2(-0.3,-0.15),t*0.8,20.0,3.0)+cpWave(uv+dx,float2(0.0,0.3),t*1.2,30.0,5.0);
    float hy=cpWave(uv+dy,float2(0.2,0.1),t,25.0,4.0)+cpWave(uv+dy,float2(-0.3,-0.15),t*0.8,20.0,3.0)+cpWave(uv+dy,float2(0.0,0.3),t*1.2,30.0,5.0);
    float3 normal=normalize(float3((h-hx)/0.001,(h-hy)/0.001,1.0));
    float3 skyColor=mix(float3(0.4,0.6,0.9),float3(0.7,0.85,1.0),uv.y+0.5);
    float3 reflected=reflect(float3(0,0,-1),normal);
    float fresnel=pow(1.0-abs(dot(float3(0,0,1),normal)),3.0);
    float3 waterColor=float3(0.05,0.2,0.35);
    float3 col=mix(waterColor,skyColor,fresnel*0.6+0.2);
    float spec=pow(max(dot(reflected,normalize(float3(0.3,0.5,1.0))),0.0),64.0);
    col+=float3(1.0,0.95,0.9)*spec*0.6;
    col+=h*0.1;
    return float4(col,1.0);
}
