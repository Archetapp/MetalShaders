#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float thHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 thresholdFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float2 fragCoord=uv*iResolution;
    float scene=sin(uv.x*8.0+t)*sin(uv.y*6.0-t*0.8)*0.25+
        smoothstep(0.25,0.0,length(uv-float2(0.5+0.2*sin(t*0.4),0.5+0.2*cos(t*0.3))))*0.5+0.4;
    float thresh=0.5+0.1*sin(t*0.5);float bw=step(thresh,scene+thHash(fragCoord+fract(t)*100.0)*0.1-0.05);
    float3 col=float3(bw);float edgeDist=abs(scene-thresh);
    if(edgeDist<0.05)col=float3(step(edgeDist*20.0,thHash(floor(fragCoord*0.5)+floor(t*3.0))));
    return float4(col,1.0);}
