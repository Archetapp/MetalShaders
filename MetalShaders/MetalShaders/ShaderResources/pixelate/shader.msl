#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 pixelateFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float blockSize=4.0+12.0*(sin(t*0.3)*0.5+0.5);
    float2 blocks=floor(uv*blockSize)/blockSize;
    float d=length(blocks-float2(0.5+0.2*sin(t),0.5+0.2*cos(t*0.7)));
    float3 scene=0.5+0.5*cos(6.28*(d*3.0+t*0.5+float3(0,0.33,0.67)));
    scene=mix(float3(0.1),scene,smoothstep(0.3,0.25,d));
    float2 cellUv=fract(uv*blockSize);
    float border=smoothstep(0.0,0.05,cellUv.x)*smoothstep(0.0,0.05,cellUv.y)*
                 smoothstep(1.0,0.95,cellUv.x)*smoothstep(1.0,0.95,cellUv.y);
    scene*=0.9+border*0.1;return float4(scene,1.0);}
