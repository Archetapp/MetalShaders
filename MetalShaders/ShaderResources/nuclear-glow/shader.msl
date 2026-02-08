#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float ngNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

fragment float4 nuclearGlowFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float r=length(uv);
    float a=atan2(uv.y,uv.x);
    float3 col=float3(0.0,0.0,0.02);
    float coreR=0.08;
    float core=smoothstep(coreR,coreR*0.3,r);
    float3 cherenkov=float3(0.1,0.4,1.0);
    col+=cherenkov*core*2.0;
    col+=float3(0.8,0.9,1.0)*smoothstep(coreR*0.3,0.0,r)*1.5;
    float innerGlow=exp(-r*8.0);
    col+=cherenkov*innerGlow*0.8;
    for(int i=0;i<6;i++){
        float fi=float(i);
        float ringR=0.15+fi*0.08;
        float phase=fract(t*0.3+fi*0.167);
        float expandR=ringR+phase*0.3;
        float ringAlpha=(1.0-phase);
        ringAlpha*=ringAlpha;
        float ring=smoothstep(0.015,0.0,abs(r-expandR))*ringAlpha;
        float n=ngNoise(float2(a*5.0+fi,t*2.0))*0.3;
        ring*=(0.7+n);
        col+=cherenkov*ring*0.6;
    }
    float rays=0.0;
    for(int i=0;i<8;i++){
        float ra=float(i)*0.785+t*0.1;
        float d=abs(sin(a-ra));
        rays+=exp(-d*30.0)*exp(-r*4.0)*0.15;
    }
    col+=cherenkov*rays;
    float flicker=0.9+0.1*sin(t*20.0)*sin(t*13.0);
    col*=flicker;
    return float4(col,1.0);
}
