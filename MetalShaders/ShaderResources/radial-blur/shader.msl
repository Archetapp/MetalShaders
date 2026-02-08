#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 rbScene(float2 uv,float t){float3 c=float3(0.0);
    for(int i=0;i<8;i++){float fi=float(i);
        float a=fi*0.785+t*0.3;float r=0.2+fi*0.03;
        float2 p=float2(0.5)+float2(cos(a),sin(a))*r;
        float d=length(uv-p);c+=float3(0.5+0.5*sin(fi),0.5+0.5*cos(fi*1.3),0.5+0.5*sin(fi*0.7))*0.01/(d+0.01);}
    return c+float3(0.02);}
fragment float4 radialBlurFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float2 center=float2(0.5+0.1*sin(t*0.4),0.5+0.1*cos(t*0.3));
    float3 col=float3(0.0);float total=0.0;
    for(int i=0;i<20;i++){float fi=float(i)/20.0;
        float2 dir=(uv-center)*fi*(0.02+0.02*sin(t*0.5));
        float w=1.0-fi*0.5;col+=rbScene(uv-dir,t)*w;total+=w;}
    col/=total;return float4(col,1.0);}
