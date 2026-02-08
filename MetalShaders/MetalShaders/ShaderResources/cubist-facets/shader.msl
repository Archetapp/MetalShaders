#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float cfHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 cubistFacetsFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float scale=5.0+sin(t*0.2);float2 cell=floor(uv*scale);float id=cfHash(cell);
    float angle=id*6.28+t*0.1;float2 f=fract(uv*scale)-0.5;
    float cs=cos(angle),sn=sin(angle);float2 rf=float2(f.x*cs-f.y*sn,f.x*sn+f.y*cs);
    float2 shifted=uv+rf*0.1;float d=length(shifted);
    float3 baseCol=0.5+0.5*cos(6.28*(id+t*0.05+float3(0,0.33,0.67)));
    float3 col=baseCol*(0.4+0.3*smoothstep(0.3,0.28,d)+0.3*step(abs(shifted.x),0.2)*step(abs(shifted.y),0.15));
    col*=0.7+0.3*(rf.x*0.5+0.5);
    float edge=smoothstep(0.0,0.05,f.x+0.5)*smoothstep(0.0,0.05,f.y+0.5)*smoothstep(1.0,0.95,f.x+0.5)*smoothstep(1.0,0.95,f.y+0.5);
    col=mix(col,float3(0.1),(1.0-edge)*0.8);
    return float4(col,1.0);}
