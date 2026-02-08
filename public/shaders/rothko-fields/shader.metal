#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float rfNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 rothkoFieldsFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float n=rfNoise(uv*3.0+t*0.05)*0.03;
    float3 bg=float3(0.15+n,0.12+n,0.1+n);
    float softness=0.04+0.01*sin(t*0.4);float margin=0.1;
    float xFade=smoothstep(margin-softness,margin,uv.x)*smoothstep(1.0-margin+softness,1.0-margin,uv.x);
    float y1=0.25+0.02*sin(t*0.2),y2=0.55+0.02*cos(t*0.3),y3=0.78;float h=0.08;
    float r1=smoothstep(y1-h-softness,y1-h,uv.y)*smoothstep(y1+h+softness,y1+h,uv.y)*xFade;
    float r2=smoothstep(y2-h*1.2-softness,y2-h*1.2,uv.y)*smoothstep(y2+h*1.2+softness,y2+h*1.2,uv.y)*xFade;
    float r3=smoothstep(y3-h*0.6-softness,y3-h*0.6,uv.y)*smoothstep(y3+h*0.6+softness,y3+h*0.6,uv.y)*xFade;
    float hs=t*0.05;float3 col=bg;
    col=mix(col,float3(0.7+0.1*sin(hs),0.15,0.1)+n,r1);
    col=mix(col,float3(0.8,0.55+0.1*sin(hs+1.0),0.1)+n,r2);
    col=mix(col,float3(0.1,0.1,0.3+0.1*sin(hs+2.0))+n,r3);
    return float4(col,1.0);}
