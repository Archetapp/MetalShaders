#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 bauhausCirclesFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.95,0.92,0.85);
    float3 colors[6]={float3(0.85,0.15,0.1),float3(0.1,0.2,0.65),float3(0.9,0.75,0.1),float3(0.15),float3(0.85,0.4,0.1),float3(0.2,0.55,0.3)};
    for(int i=0;i<6;i++){float fi=float(i);float angle=fi*1.047+t*0.2;
        float radius=0.15+0.05*sin(t*0.3+fi);
        float2 center=float2(cos(angle),sin(angle))*(0.12+0.05*sin(t*0.5+fi));
        float d=length(uv-center);col=mix(col,colors[i],smoothstep(radius,radius-0.003,d)*0.85);}
    col=mix(col,float3(0.1),smoothstep(0.005,0.0,abs(length(uv)-0.35)));
    return float4(col,1.0);}
