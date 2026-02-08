#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 bgScene(float2 uv,float t){float3 c=float3(0.02,0.02,0.04);
    for(int i=0;i<5;i++){float fi=float(i);
        float2 p=float2(0.2+fi*0.15,0.5+0.2*sin(t+fi));
        float d=length(uv-p);float bright=step(d,0.03);
        float3 col=0.6+0.4*cos(6.28*(fi*0.2+float3(0,0.33,0.67)));
        c+=col*bright+col*0.01/(d+0.01);}return c;}
fragment float4 bloomGlowFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene=bgScene(uv,t);
    float3 bloom=float3(0.0);float total=0.0;
    for(int x=-6;x<=6;x++)for(int y=-6;y<=6;y++){
        float2 off=float2(float(x),float(y))*0.005;float w=exp(-float(x*x+y*y)*0.08);
        float3 s=bgScene(uv+off,t);bloom+=s*max(0.0,max(max(s.r,s.g),s.b)-0.5)*w;total+=w;}
    bloom/=total;return float4(1.0-exp(-(scene+bloom*2.0)*1.5),1.0);}
