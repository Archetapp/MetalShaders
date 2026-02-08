#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 mbScene(float2 uv,float t){
    float d=length(uv-float2(0.5+0.3*sin(t*2.0),0.5+0.2*cos(t*1.5)));
    float3 c=float3(0.8,0.3,0.1)*0.03/(d+0.02);
    d=length(uv-float2(0.3+0.2*cos(t*1.7),0.5+0.25*sin(t*1.3)));
    c+=float3(0.1,0.3,0.8)*0.02/(d+0.02);
    d=length(uv-float2(0.7+0.15*sin(t*2.3),0.4+0.2*cos(t*1.8)));
    c+=float3(0.1,0.8,0.3)*0.02/(d+0.02);
    return c+float3(0.02,0.02,0.04);}
fragment float4 motionBlurFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float angle=t*0.3;float2 dir=float2(cos(angle),sin(angle));
    float3 col=float3(0.0);float total=0.0;
    for(int i=-10;i<=10;i++){float fi=float(i)*0.015;
        float w=exp(-float(i*i)*0.05);col+=mbScene(uv+dir*fi,t)*w;total+=w;}
    col/=total;return float4(col,1.0);}
