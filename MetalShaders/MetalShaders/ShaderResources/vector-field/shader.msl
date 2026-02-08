#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 vectorFieldFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float grid=16.0;float2 cell=floor(uv*grid+0.5);float2 cellUv=fract(uv*grid+0.5)-0.5;
    float2 p=cell/grid;float2 field=float2(sin(p.y*6.28+t),cos(p.x*6.28+t*0.7));
    float mag=length(field);float2 dir=field/(mag+0.001);float angle=atan2(dir.y,dir.x);
    float cs=cos(-angle),sn=sin(-angle);
    float2 rp=float2(cellUv.x*cs-cellUv.y*sn,cellUv.x*sn+cellUv.y*cs);
    float shaft=smoothstep(0.03,0.01,abs(rp.y))*smoothstep(-0.3,0.0,rp.x)*smoothstep(0.4,0.2,rp.x);
    float head=smoothstep(0.0,-0.1,rp.x-0.2+abs(rp.y)*2.0)*smoothstep(0.2,0.3,rp.x);
    float3 col=float3(0.03,0.03,0.08);
    col+=(0.5+0.5*cos(6.28*(angle/6.28+0.5+float3(0,0.33,0.67))))*(shaft+head)*min(mag*0.5,1.0)*0.8;
    col+=float3(0.15)*smoothstep(0.06,0.04,length(cellUv));
    return float4(col,1.0);}
