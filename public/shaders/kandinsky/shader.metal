#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float kdHash(float p){return fract(sin(p*127.1)*43758.5);}
fragment float4 kandinskyFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.92,0.88,0.82);
    for(int i=0;i<8;i++){float fi=float(i);
        float2 center=float2(kdHash(fi*3.0)-0.5,kdHash(fi*3.0+1.0)-0.5)*0.7+float2(sin(t*0.3+fi),cos(t*0.4+fi*1.3))*0.05;
        float r=0.05+kdHash(fi*3.0+2.0)*0.12;float d=length(uv-center);
        float3 c;float idx=fmod(fi,4.0);
        if(idx<1.0)c=float3(0.8,0.15,0.1);else if(idx<2.0)c=float3(0.1,0.15,0.6);
        else if(idx<3.0)c=float3(0.9,0.75,0.1);else c=float3(0.15);
        col=mix(col,c,smoothstep(r,r-0.003,d)*0.8);
        col=mix(col,float3(0.1),smoothstep(0.003,0.0,abs(d-r)));}
    for(int i=0;i<5;i++){float fi=float(i);
        float2 a=float2(kdHash(fi*5.0+10.0)-0.5,kdHash(fi*5.0+11.0)-0.5)*0.8;
        float2 b=float2(kdHash(fi*5.0+12.0)-0.5,kdHash(fi*5.0+13.0)-0.5)*0.8;
        float2 ab=b-a;float len=length(ab);float2 dir=ab/len;
        float proj=clamp(dot(uv-a,dir),0.0,len);
        col=mix(col,float3(0.1),smoothstep(0.003,0.0,length(uv-(a+dir*proj))));}
    return float4(col,1.0);}
