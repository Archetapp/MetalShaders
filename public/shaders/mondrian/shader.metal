#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float mnHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 mondrianFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float seed=floor(t*0.1);
    float3 col=float3(0.95,0.93,0.88);
    float gridX=floor(uv.x*(4.0+2.0*mnHash(float2(seed,0.0))))/6.0;
    float gridY=floor(uv.y*(4.0+2.0*mnHash(float2(seed,1.0))))/6.0;
    float2 cell=float2(gridX,gridY);
    float id=mnHash(cell+seed);
    if(id>0.75)col=float3(0.85,0.15,0.1);
    else if(id>0.55)col=float3(0.1,0.2,0.6);
    else if(id>0.4)col=float3(0.9,0.8,0.15);
    float lineW=0.008;float lineH=smoothstep(lineW,0.0,fract(uv.x*6.0))+smoothstep(1.0-lineW,1.0,fract(uv.x*6.0));
    float lineV=smoothstep(lineW,0.0,fract(uv.y*6.0))+smoothstep(1.0-lineW,1.0,fract(uv.y*6.0));
    col=mix(col,float3(0.05),min(max(lineH,lineV),1.0));
    float borderW=0.015;col=mix(col,float3(0.05),min(step(uv.x,borderW)+step(1.0-borderW,uv.x)+step(uv.y,borderW)+step(1.0-borderW,uv.y),1.0));
    return float4(col,1.0);}
