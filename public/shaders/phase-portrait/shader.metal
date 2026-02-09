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
    float streamline=0.0;float2 pos=uv;
    for(int i=0;i<30;i++){float2 f2;
        if(mode<1.0)f2=float2(-pos.y-pos.x*(dot(pos,pos)-1.0),pos.x-pos.y*(dot(pos,pos)-1.0));
        else if(mode<2.0)f2=float2(pos.y,-sin(pos.x)+0.1*pos.y*sin(t*0.5));
        else f2=float2(pos.x-pos.x*pos.y,pos.x*pos.y-pos.y);
        pos-=normalize(f2+0.001)*0.05;float d=length(uv-pos);
        streamline+=0.001/(d+0.005)*(1.0-float(i)/30.0);}
    col+=float3(1.0)*streamline*0.3;
    col+=float3(0.1)*smoothstep(0.03,0.0,abs(uv.x))+float3(0.1)*smoothstep(0.03,0.0,abs(uv.y));
    return float4(col,1.0);}
