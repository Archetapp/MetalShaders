#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 gbScene(float2 uv,float t){
    float3 c=float3(0.0);
    for(int i=0;i<5;i++){float fi=float(i);
        float2 p=float2(0.3+fi*0.12,0.5+0.2*sin(t+fi));
        float d=length(uv-p);float3 col=0.5+0.5*cos(6.28*(fi*0.2+float3(0,0.33,0.67)));
        c+=col*0.02/(d*d+0.01);}
    c+=float3(0.05,0.05,0.1);return c;}
fragment float4 gaussianBlurFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float blurAmount=0.003+0.003*sin(t*0.5);
    float3 col=float3(0.0);float total=0.0;
    for(int x=-4;x<=4;x++)for(int y=-4;y<=4;y++){
        float2 off=float2(float(x),float(y))*blurAmount;
        float w=exp(-float(x*x+y*y)*0.2);col+=gbScene(uv+off,t)*w;total+=w;}
    col/=total;float split=0.5+0.1*sin(t*0.3);
    if(uv.x>split)col=gbScene(uv,t);
    col+=float3(1.0)*smoothstep(0.002,0.0,abs(uv.x-split));
    return float4(col,1.0);}
