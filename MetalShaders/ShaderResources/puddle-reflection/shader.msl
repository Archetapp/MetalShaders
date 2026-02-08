#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float prNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

fragment float4 puddleReflectionFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.5;
    float3 sky=mix(float3(0.6,0.7,0.9),float3(0.2,0.3,0.5),uv.y);
    float horizon=0.55;
    float3 ground=float3(0.25,0.2,0.15);
    float treeLine=step(horizon-0.05,uv.y)*step(uv.y,horizon+0.15);
    float3 trees=float3(0.1,0.2,0.05)*treeLine;
    float3 scene=uv.y>horizon?mix(sky,trees,treeLine):ground;
    float puddleMask=smoothstep(0.4,0.35,length((uv-float2(0.5,0.3))*float2(1.5,2.5)));
    if(puddleMask>0.01){
        float reflY=horizon-(uv.y-0.0);
        float distort=prNoise(uv*10.0+t)*0.02+prNoise(uv*20.0+t*1.5)*0.01;
        float2 reflUV=float2(uv.x+distort,reflY+distort);
        float3 reflScene=mix(float3(0.6,0.7,0.9),float3(0.2,0.3,0.5),reflUV.y);
        float reflTree=step(horizon-0.05,reflUV.y)*step(reflUV.y,horizon+0.15);
        reflScene=mix(reflScene,float3(0.1,0.2,0.05),reflTree);
        reflScene*=0.7;
        float ripple=sin(length(uv-float2(0.5,0.3))*60.0-t*3.0)*0.02;
        reflScene+=ripple;
        scene=mix(scene,reflScene,puddleMask*0.85);
        float edgeGlint=pow(1.0-puddleMask,10.0)*puddleMask*5.0;
        scene+=float3(0.3,0.35,0.4)*edgeGlint;
    }
    return float4(scene,1.0);
}
