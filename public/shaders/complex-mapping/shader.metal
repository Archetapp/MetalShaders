#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float2 cmMul(float2 a,float2 b){return float2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}
float2 cmDiv(float2 a,float2 b){float d=dot(b,b);return float2(a.x*b.x+a.y*b.y,a.y*b.x-a.x*b.y)/d;}
fragment float4 complexMappingFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0)*3.0;float t=iTime;
    float2 z=uv;float mode=fmod(t*0.15,4.0);float2 w;
    if(mode<1.0)w=cmMul(z,z)+float2(sin(t*0.3),cos(t*0.3))*0.5;
    else if(mode<2.0)w=cmDiv(float2(1.0,0.0),z)+float2(0.5*sin(t*0.3),0.0);
    else if(mode<3.0){w=z;for(int i=0;i<3;i++)w=cmMul(w,w)+float2(-0.7+0.1*sin(t*0.3),0.27);}
    else w=float2(exp(z.x)*cos(z.y+t*0.3),exp(z.x)*sin(z.y+t*0.3));
    float hue=atan2(w.y,w.x)/6.28318+0.5;float mag=length(w);
    float3 col=0.5+0.5*cos(6.28*(hue+float3(0,0.33,0.67)));
    col*=(1.0-1.0/(1.0+mag*0.5))*(fract(log2(mag+0.001))*0.3+0.7);
    return float4(col,1.0);}
