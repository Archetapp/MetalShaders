#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float hsNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

fragment float4 heatShimmerFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime;
    float horizonY=0.35;
    float distortStrength=smoothstep(horizonY+0.3,horizonY,uv.y)*0.02;
    float n1=hsNoise(float2(uv.x*8.0,uv.y*15.0-t*2.0));
    float n2=hsNoise(float2(uv.x*12.0+5.0,uv.y*20.0-t*3.0));
    float2 distort=float2(n1-0.5,n2-0.5)*distortStrength;
    float2 duv=uv+distort;
    float3 sky=mix(float3(0.9,0.85,0.7),float3(0.4,0.55,0.8),smoothstep(horizonY,0.9,duv.y));
    float haze=exp(-(duv.y-horizonY)*3.0)*step(horizonY,duv.y)*0.3;
    sky+=float3(0.3,0.25,0.15)*haze;
    float3 ground=mix(float3(0.85,0.75,0.55),float3(0.7,0.6,0.4),smoothstep(0.0,horizonY,duv.y));
    float3 col=duv.y>horizonY?sky:ground;
    float roadY=horizonY*0.8;
    float roadMask=smoothstep(roadY+0.05,roadY,duv.y)*smoothstep(0.0,roadY*0.3,duv.y);
    col=mix(col,float3(0.25,0.25,0.25),roadMask*0.6);
    float mirage=smoothstep(horizonY,horizonY-0.1,duv.y)*distortStrength*20.0;
    col=mix(col,sky*0.8,mirage*0.5);
    float shimmerVis=abs(distort.x+distort.y)*200.0;
    col+=float3(0.1)*shimmerVis*smoothstep(horizonY+0.2,horizonY,uv.y);
    return float4(col,1.0);
}
