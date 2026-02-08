#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 channelMixerFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene;
    scene.r=sin(uv.x*10.0+t)*0.5+0.5;scene.g=sin(uv.y*8.0-t*0.7)*0.5+0.5;
    scene.b=cos(length(uv-0.5)*15.0+t*0.5)*0.5+0.5;
    float mode=fmod(t*0.2,3.0);float3 mixed;
    if(mode<1.0){mixed.r=scene.g;mixed.g=scene.b;mixed.b=scene.r;}
    else if(mode<2.0){mixed.r=scene.b;mixed.g=scene.r;mixed.b=scene.g;}
    else{mixed.r=1.0-scene.r;mixed.g=scene.g;mixed.b=1.0-scene.b;}
    float3 col=mix(scene,mixed,smoothstep(0.0,0.1,fract(mode)));
    float wave=sin(uv.x*50.0+t*2.0)*0.02;col.r+=wave;col.b-=wave;
    return float4(clamp(col,0.0,1.0),1.0);}
