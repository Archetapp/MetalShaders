#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 posterizeFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene;float d=length(uv-float2(0.5));
    scene.r=0.5+0.5*sin(uv.x*5.0+t);scene.g=0.5+0.5*sin(uv.y*7.0-t*0.7);scene.b=0.5+0.5*cos(d*10.0+t*0.5);
    float levels=3.0+3.0*sin(t*0.3);float3 posterized=floor(scene*levels+0.5)/levels;
    float3 col=mix(scene,posterized,smoothstep(0.48,0.52,uv.x+0.1*sin(t*0.5)));
    return float4(pow(col,float3(0.9)),1.0);}
