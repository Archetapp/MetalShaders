#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float emScene(float2 uv,float t){float v=0.0;
    for(int i=0;i<5;i++){float fi=float(i);
        float2 p=float2(0.2+fi*0.15,0.5+0.15*sin(t*0.4+fi*1.3));
        v+=smoothstep(0.12,0.08,length(uv-p))*(0.5+fi*0.1);}
    v+=sin(uv.x*30.0)*sin(uv.y*30.0)*0.05;return v;}
fragment float4 embossFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float angle=t*0.3;float2 dir=float2(cos(angle),sin(angle));
    float2 px=1.0/iResolution;
    float emboss=(emScene(uv+dir*px,t)-emScene(uv-dir*px,t))*3.0+0.5;
    float3 col=float3(emboss)*float3(0.9,0.85,0.75);
    col=mix(col,col*float3(0.7,0.8,1.0),emScene(uv,t)*0.3);
    return float4(col,1.0);}
