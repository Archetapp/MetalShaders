#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float pdHash(float2 p){return fract(sin(dot(p,float2(12.9,78.2)))*43758.5);}

fragment float4 polkaDotsFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime;
    float scale=10.0;
    float2 p=uv*scale;
    float2 cell=floor(p);
    float2 f=fract(p)-0.5;
    float h=pdHash(cell);
    float phase=h*6.2832+t*2.0;
    float radius=0.25+0.1*sin(phase);
    float d=length(f);
    float dot_shape=smoothstep(radius+0.02,radius-0.02,d);
    float3 dotCol=0.5+0.5*cos(h*6.28+t*0.5+float3(0,2,4));
    float3 bgCol=float3(0.95,0.93,0.9);
    float3 col=mix(bgCol,dotCol,dot_shape);
    float shadow=smoothstep(radius+0.08,radius,d)*0.15;
    col-=shadow;
    return float4(col,1.0);
}
