#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float csHash2(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5);}
float csNoise2(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(csHash2(i),csHash2(i+float2(1,0)),f.x),mix(csHash2(i+float2(0,1)),csHash2(i+float2(1,1)),f.x),f.y);
}
float csFbm2(float2 p){float v=0.0;float a=0.5;for(int i=0;i<6;i++){v+=a*csNoise2(p);p*=2.0;a*=0.5;}return v;}

fragment float4 cloudShadowsFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.08;
    float3 groundLit=float3(0.45,0.6,0.25);
    float3 groundShade=float3(0.2,0.35,0.12);
    float grassDetail=csNoise2(uv*50.0)*0.05;
    float3 ground=groundLit+grassDetail;
    float perspective=1.0/(0.5+uv.y*1.5);
    float2 cloudUV=float2(uv.x*perspective+t,uv.y*perspective+t*0.3);
    float clouds=csFbm2(cloudUV*2.0);
    float softness=0.1+uv.y*0.2;
    float shadowMask=smoothstep(0.5-softness,0.5+softness,clouds);
    ground=mix(ground,groundShade,shadowMask*0.6);
    float lightShaft=1.0-shadowMask;
    ground+=float3(0.1,0.08,0.02)*lightShaft*0.3;
    float3 col=ground;
    float horizon=smoothstep(0.95,1.0,uv.y);
    float3 sky=mix(float3(0.5,0.65,0.9),float3(0.35,0.5,0.8),uv.y);
    float skyClouds=csFbm2(float2(uv.x*3.0+t,uv.y*2.0));
    sky=mix(sky,float3(0.9,0.92,0.95),smoothstep(0.4,0.7,skyClouds)*0.5);
    col=mix(col,sky,horizon);
    float pathX=0.5+sin(uv.y*3.0)*0.05;
    float path=smoothstep(0.03,0.02,abs(uv.x-pathX))*(1.0-horizon);
    col=mix(col,float3(0.55,0.5,0.4),path*0.4);
    return float4(col,1.0);
}
