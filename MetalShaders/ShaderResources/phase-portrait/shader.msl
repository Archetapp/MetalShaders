#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 phasePortraitFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0)*3.0;float t=iTime;
    float mode=fmod(t*0.1,3.0);float2 field;
    if(mode<1.0)field=float2(-uv.y-uv.x*(dot(uv,uv)-1.0),uv.x-uv.y*(dot(uv,uv)-1.0));
    else if(mode<2.0)field=float2(uv.y,-sin(uv.x)+0.1*uv.y*sin(t*0.5));
    else field=float2(uv.x-uv.x*uv.y,uv.x*uv.y-uv.y);
    float mag=length(field);float2 dir=field/(mag+0.001);
    float angle=atan2(dir.y,dir.x);float arrows=sin(dot(uv,dir)*20.0+mag*5.0-t*3.0)*0.5+0.5;
    float3 col=0.5+0.5*cos(6.28*(angle/6.28+0.5+float3(0,0.33,0.67)));
    col*=0.3+0.5*arrows*min(mag*0.5,1.0);
    return float4(col,1.0);}
