#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float hbHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 herringboneFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.2;
    float scale=6.0;
    float2 p=uv*scale;
    float row=floor(p.y);
    float shift=fmod(row,2.0)*0.5;
    float2 bp=float2(p.x+shift,p.y);
    float brickW=1.0,brickH=0.5;
    float2 cell=floor(bp/float2(brickW,brickH));
    float2 f=fract(bp/float2(brickW,brickH));
    float dir=fmod(cell.x+cell.y,2.0);
    float2 tf=dir>0.5?float2(f.y,f.x):f;
    float h=hbHash(cell);
    float3 baseCol=float3(0.7+0.15*h,0.45+0.1*h,0.3+0.05*h);
    baseCol+=0.1*cos(t+cell.x*0.5+float3(0,1,2));
    float mortar=0.04;
    float mx=smoothstep(0.0,mortar,tf.x)*smoothstep(1.0,1.0-mortar,tf.x);
    float my=smoothstep(0.0,mortar,tf.y)*smoothstep(1.0,1.0-mortar,tf.y);
    float m=mx*my;
    float3 mortarCol=float3(0.85,0.82,0.78);
    float3 col=mix(mortarCol,baseCol,m);
    float vignette=1.0-0.3*length(uv-0.5);
    col*=vignette;
    return float4(col,1.0);
}
