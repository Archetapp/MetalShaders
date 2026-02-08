#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float cfNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

fragment float4 candleFlameFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 col=float3(0.02,0.01,0.03);
    float2 flameUV=uv-float2(0.0,-0.15);
    float flicker=cfNoise(float2(t*8.0,0.0))*0.03;
    flameUV.x+=flicker;
    flameUV.x+=sin(flameUV.y*8.0+t*5.0)*0.02*(1.0-flameUV.y);
    float flameH=0.35+0.05*sin(t*3.0);
    float width=0.08*(1.0-flameUV.y/flameH);
    width*=smoothstep(0.0,0.1,flameUV.y);
    float flameMask=smoothstep(width,width-0.02,abs(flameUV.x))*smoothstep(-0.02,0.05,flameUV.y)*smoothstep(flameH,flameH-0.1,flameUV.y);
    float n=cfNoise(float2(flameUV.x*10.0,flameUV.y*5.0-t*6.0));
    flameMask*=0.7+0.3*n;
    float coreWidth=width*0.3;
    float coreMask=smoothstep(coreWidth,coreWidth-0.01,abs(flameUV.x))*smoothstep(-0.01,0.05,flameUV.y)*smoothstep(flameH*0.5,0.05,flameUV.y);
    float3 outerFlame=mix(float3(0.8,0.2,0.0),float3(1.0,0.7,0.0),flameUV.y/flameH);
    float3 innerFlame=mix(float3(0.2,0.3,0.8),float3(1.0,0.9,0.5),flameUV.y/(flameH*0.5));
    float3 flameCol=mix(outerFlame,innerFlame,coreMask);
    col+=flameCol*flameMask*1.5;
    float glow=exp(-length(flameUV-float2(0,0.1))*5.0)*0.3;
    col+=float3(0.4,0.15,0.02)*glow;
    float wickY=-0.02;
    float wickMask=smoothstep(0.003,0.0,abs(flameUV.x))*smoothstep(wickY-0.1,wickY,flameUV.y)*smoothstep(0.03,0.0,flameUV.y);
    col=mix(col,float3(0.05),wickMask);
    return float4(col,1.0);
}
