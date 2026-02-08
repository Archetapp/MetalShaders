#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float srNoise2(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 swipeRevealFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float progress=fract(t*0.2);
    float3 sceneA=float3(0.2,0.3,0.5)+float3(0.1)*sin(uv.x*10.0+t)*sin(uv.y*10.0);
    float3 sceneB=float3(0.5,0.2,0.3)+float3(0.1)*cos(uv.x*8.0-t)*cos(uv.y*8.0);
    float diag=uv.x*cos(0.7854)+uv.y*sin(0.7854);float wipePos=progress*2.0-0.5;
    float feather=0.05+0.03*sin(t*2.0);float noise=srNoise2(uv*20.0)*0.03;
    float wipe=smoothstep(wipePos-feather,wipePos+feather,diag+noise);
    float3 col=mix(sceneA,sceneB,wipe);
    col+=float3(1.0)*(smoothstep(wipePos-feather*0.5,wipePos,diag+noise)-smoothstep(wipePos,wipePos+feather*0.5,diag+noise))*0.3;
    return float4(col,1.0);}
