#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float soCircle(float2 p,float r){return length(p)-r;}
float soBox(float2 p,float2 b){float2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float soTriangle(float2 p,float r){float k=sqrt(3.0);p.x=abs(p.x)-r;p.y=p.y+r/k;
    if(p.x+k*p.y>0.0)p=float2(p.x-k*p.y,-k*p.x-p.y)/2.0;p.x-=clamp(p.x,-2.0*r,0.0);return -length(p)*sign(p.y);}
fragment float4 sdfOutlineFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.95,0.93,0.9);float w=0.003;
    float d1=soCircle(uv-float2(-0.3,0.0),0.2);float d2=soBox(uv,float2(0.15));float d3=soTriangle(uv-float2(0.3,0.0),0.2);
    col=mix(col,float3(0.1,0.2,0.8),smoothstep(w,0.0,abs(d1)-0.005));
    col=mix(col,float3(0.2,0.7,0.3),smoothstep(w,0.0,abs(d2)-0.005));
    col=mix(col,float3(0.8,0.2,0.1),smoothstep(w,0.0,abs(d3)-0.005)*step(0.0,sin(atan2(uv.y,uv.x-0.3)*8.0+t*3.0)));
    col-=smoothstep(0.005,0.0,d1)*0.1*float3(0,0,0.3);col-=smoothstep(0.005,0.0,d2)*0.1*float3(0,0.3,0);
    float anim=sin(t*2.0)*0.5+0.5;
    float grow=soCircle(uv-float2(-0.3,0.0),0.2*anim);
    float animOutline=smoothstep(w,0.0,abs(grow)-0.003);
    col=mix(col,float3(0.8,0.5,0.1),animOutline*0.5);
    return float4(col,1.0);}
