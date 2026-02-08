#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float ttHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 truchetTrianglesFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.uv;
    float scale=10.0;
    float2 cell=floor(uv*scale);
    float2 f=fract(uv*scale);
    float h=ttHash(cell);
    float flip=step(0.5,fract(h+iTime*0.3));
    if(flip>0.5) f=float2(1.0-f.x,f.y);
    float d1=f.x+f.y-1.0;
    float d2=f.x-f.y;
    float t=iTime*0.5;
    float3 c1=0.5+0.5*cos(t+float3(0,2,4)+cell.x*0.5);
    float3 c2=0.5+0.5*cos(t+float3(1,3,5)+cell.y*0.5);
    float3 col=mix(c1,c2,step(0.0,d1));
    float edge=min(abs(d1),abs(d2));
    edge=min(edge,min(min(f.x,f.y),min(1.0-f.x,1.0-f.y)));
    float line=1.0-smoothstep(0.0,0.03,edge);
    col=mix(col,float3(1),line*0.7);
    return float4(col,1.0);
}
