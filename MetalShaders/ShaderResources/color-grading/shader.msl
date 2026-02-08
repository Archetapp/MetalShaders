#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 colorGradingFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene;
    scene.r=0.5+0.3*sin(uv.x*8.0+t);scene.g=0.4+0.3*sin(uv.y*6.0-t*0.8);
    scene.b=0.3+0.4*cos(length(uv-0.5)*10.0+t*0.5);
    scene.r+=sin(t*0.3)*0.3*0.15;scene.b-=sin(t*0.3)*0.3*0.15;scene.g+=cos(t*0.4)*0.2*0.1;
    float luma=dot(scene,float3(0.299,0.587,0.114));
    scene=(scene-0.5)*(1.2+0.3*sin(t*0.5))+0.5;
    scene=mix(float3(luma),scene,1.0+0.5*sin(t*0.6));
    scene=(scene+0.02*sin(t*0.7))*(1.0+0.1*sin(t*0.3));
    scene=pow(max(scene,float3(0.0)),float3(1.0/(1.0+0.1*cos(t*0.4))));
    return float4(clamp(scene,0.0,1.0),1.0);}
