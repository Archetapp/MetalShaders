#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float ptHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 pointillismFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene;
    scene.r=0.5+0.3*sin(uv.x*4.0+t*0.5);scene.g=0.4+0.3*sin(uv.y*3.0-t*0.3+1.0);
    scene.b=0.3+0.3*cos(length(uv-0.5)*6.0+t*0.4);
    float dotGrid=40.0;float2 cell=floor(uv*dotGrid);float2 f=fract(uv*dotGrid);
    float2 dotCenter=float2(0.5+0.1*(ptHash(cell)-0.5),0.5+0.1*(ptHash(cell+float2(1,0))-0.5));
    float dotSize=0.3+0.1*ptHash(cell+float2(2,0));
    float3 dotColor=clamp(scene+float3(ptHash(cell+float2(3,0))-0.5,ptHash(cell+float2(4,0))-0.5,ptHash(cell+float2(5,0))-0.5)*0.15,0.0,1.0);
    float3 col=mix(float3(0.92,0.88,0.82),dotColor,smoothstep(dotSize,dotSize-0.1,length(f-dotCenter)));
    return float4(col,1.0);}
