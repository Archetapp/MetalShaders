#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float dsHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 deStijlFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 col=float3(0.92,0.9,0.85);
    float hLines[4]={0.2,0.45,0.65,0.85};float vLines[4]={0.15,0.4,0.7,0.9};
    for(int i=0;i<4;i++){
        col=mix(col,float3(0.05),smoothstep(0.006,0.0,abs(uv.y-(hLines[i]+0.02*sin(t*0.3+float(i))))));
        col=mix(col,float3(0.05),smoothstep(0.006,0.0,abs(uv.x-(vLines[i]+0.02*sin(t*0.2+float(i)*1.5)))));}
    float cellX=0.0,cellY=0.0;
    for(int i=0;i<4;i++){if(uv.x>vLines[i])cellX=float(i+1);if(uv.y>hLines[i])cellY=float(i+1);}
    float id=dsHash(float2(cellX,cellY)+floor(t*0.05));
    if(id>0.85)col=mix(col,float3(0.85,0.12,0.1),0.9);
    else if(id>0.7)col=mix(col,float3(0.1,0.15,0.55),0.9);
    else if(id>0.6)col=mix(col,float3(0.9,0.78,0.1),0.9);
    return float4(col,1.0);}
