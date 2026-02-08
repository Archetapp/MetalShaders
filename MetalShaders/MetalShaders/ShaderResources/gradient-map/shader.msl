#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 gmRamp(float v,float t){
    float3 c0=float3(0.05,0.0,0.2);float3 c1=float3(0.8,0.1,0.3);
    float3 c2=float3(1.0,0.6,0.1);float3 c3=float3(1.0,0.95,0.8);
    v=clamp(v+sin(t*0.3)*0.1,0.0,1.0);
    if(v<0.33)return mix(c0,c1,v*3.0);if(v<0.66)return mix(c1,c2,(v-0.33)*3.0);
    return mix(c2,c3,(v-0.66)*3.0);}
fragment float4 gradientMapFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float luma=sin(uv.x*10.0+t)*sin(uv.y*8.0-t*0.7)*0.3+
        smoothstep(0.3,0.0,length(uv-float2(0.5+0.2*sin(t*0.5),0.5+0.2*cos(t*0.3))))*0.4+0.3;
    return float4(gmRamp(luma,t),1.0);}
