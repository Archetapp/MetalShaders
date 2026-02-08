#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float exNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float exFbm(float2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*exNoise(p);p*=2.0;a*=0.5;}return v;}

fragment float4 explosionFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=fmod(iTime,4.0);
    float3 col=float3(0.02);
    float r=length(uv);
    float a=atan2(uv.y,uv.x);
    float expand=t*0.3;
    float fireball=smoothstep(expand+0.05,expand-0.05,r);
    float n=exFbm(float2(a*3.0,r*5.0-t*2.0));
    fireball*=0.5+0.5*n;
    fireball*=smoothstep(4.0,1.0,t);
    float3 fireCol=mix(float3(1.0,0.9,0.3),float3(1.0,0.3,0.0),r/max(expand,0.01));
    fireCol=mix(fireCol,float3(0.3,0.1,0.0),smoothstep(0.5,1.0,t*0.3));
    col+=fireCol*fireball*2.0;
    float shockR=t*0.5;
    float shockW=0.02+t*0.01;
    float shock=smoothstep(shockW,0.0,abs(r-shockR))*smoothstep(3.0,0.5,t);
    col+=float3(1.0,0.8,0.5)*shock*0.8;
    float smoke=exFbm(float2(a*2.0+t*0.3,r*3.0-t*0.5));
    float smokeMask=smoothstep(expand*1.5,expand*0.5,r)*smoothstep(1.0,2.0,t);
    col=mix(col,float3(0.15,0.12,0.1),smokeMask*smoke*0.6);
    float flash=exp(-t*3.0)*0.5;
    col+=float3(1.0,0.9,0.7)*flash;
    return float4(col,1.0);
}
