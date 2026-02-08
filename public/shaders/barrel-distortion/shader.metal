#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 barrelDistortionFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float2 d=uv-0.5;float r2=dot(d,d);
    float k=0.3+0.2*sin(t*0.5);float2 distorted=float2(0.5)+d*(1.0+k*r2+k*0.5*r2*r2);
    float3 col=float3(0.0);
    if(distorted.x>=0.0&&distorted.x<=1.0&&distorted.y>=0.0&&distorted.y<=1.0){
        float checker=fmod(floor(distorted.x*15.0)+floor(distorted.y*15.0),2.0);
        col=mix(float3(0.8,0.2,0.3),float3(0.2,0.3,0.8),checker);
        for(int i=0;i<4;i++){float fi=float(i);
            float2 p=float2(0.25+fi*0.2,0.5+0.15*sin(t+fi));
            col=mix(col,float3(1.0,0.9,0.3),smoothstep(0.08,0.06,length(distorted-p)));}}
    return float4(col,1.0);}
