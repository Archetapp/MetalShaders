#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 vignetteFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float checker=fmod(floor(uv.x*20.0)+floor(uv.y*20.0),2.0);
    float3 scene=mix(float3(0.3,0.5,0.7),float3(0.7,0.5,0.3),checker);
    scene+=0.1*sin(uv.x*10.0+t)*sin(uv.y*10.0-t);
    float d=length((uv-0.5)*float2(iResolution.x/iResolution.y,1.0));
    float mode=fmod(floor(t*0.2),4.0);
    float vig;
    if(mode<1.0)vig=1.0-d*d*1.5;
    else if(mode<2.0)vig=smoothstep(0.8,0.2,d);
    else if(mode<3.0)vig=1.0-pow(d*1.2,3.0);
    else vig=cos(d*1.57)*cos(d*1.57);
    vig=clamp(vig,0.0,1.0);vig=mix(1.0,vig,0.5+0.3*sin(t*0.5));
    scene*=vig;return float4(scene,1.0);}
