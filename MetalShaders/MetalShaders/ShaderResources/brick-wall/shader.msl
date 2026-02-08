#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float bwHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float bwNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(bwHash(i),bwHash(i+float2(1,0)),f.x),mix(bwHash(i+float2(0,1)),bwHash(i+float2(1,1)),f.x),f.y);
}

fragment float4 brickWallFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.1;
    float2 brickSize=float2(0.15,0.075);
    float row=floor(uv.y/brickSize.y);
    float offset=fmod(row,2.0)*0.5*brickSize.x;
    float2 brickUV=float2((uv.x+offset)/brickSize.x,uv.y/brickSize.y);
    float2 cell=floor(brickUV);
    float2 f=fract(brickUV);
    float mortar=0.06;
    float mx=smoothstep(0.0,mortar,f.x)*smoothstep(1.0,1.0-mortar,f.x);
    float my=smoothstep(0.0,mortar,f.y)*smoothstep(1.0,1.0-mortar,f.y);
    float m=mx*my;
    float h=bwHash(cell);
    float n=bwNoise(cell*5.0+f*3.0);
    float3 brickCol=float3(0.65+0.15*h,0.25+0.1*h,0.15+0.08*h);
    brickCol+=0.05*n;
    brickCol+=0.03*sin(t+cell.x*2.0+float3(0,1,2));
    float3 mortarCol=float3(0.75,0.73,0.7);
    float3 col=mix(mortarCol,brickCol,m);
    float ao=smoothstep(0.0,0.15,f.x)*smoothstep(0.0,0.15,f.y)*smoothstep(1.0,0.85,f.x)*smoothstep(1.0,0.85,f.y);
    col*=0.85+0.15*ao;
    return float4(col,1.0);
}
