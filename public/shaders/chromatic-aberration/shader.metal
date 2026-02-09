#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float caScene(float2 uv,float t){float v=0.0;
    for(int i=0;i<6;i++){float fi=float(i);
        float2 p=float2(0.5+0.25*cos(t*0.5+fi),0.5+0.25*sin(t*0.3+fi*1.3));
        v+=0.02/(length(uv-p)+0.02);}
    v+=sin(uv.x*20.0+t)*sin(uv.y*20.0-t)*0.1;return v;}
fragment float4 chromaticAberrationFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float2 dir=uv-float2(0.5);float dist=length(dir);
    float strength=0.01+0.005*sin(t*0.7);
    float r=caScene(uv+dir*strength*dist,t);float g=caScene(uv,t);float b=caScene(uv-dir*strength*dist,t);
    float3 col=float3(r,g,b);
    col*=0.95+0.05*cos(dist*20.0);
    return float4(col,1.0);}
