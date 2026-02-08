#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 tartanPlaidFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.15;
    float scale=4.0;
    float2 p=uv*scale;
    float3 base=float3(0.15,0.08,0.08);
    float3 col=base;
    float px=fract(p.x);
    float py=fract(p.y);
    float3 stripe1=float3(0.7,0.1,0.1);
    float3 stripe2=float3(0.1,0.3,0.1);
    float3 stripe3=float3(0.9,0.8,0.2);
    float3 stripe4=float3(0.1,0.1,0.6);
    float s1x=smoothstep(0.08,0.1,px)*smoothstep(0.35,0.33,px);
    float s2x=smoothstep(0.45,0.47,px)*smoothstep(0.55,0.53,px);
    float s3x=smoothstep(0.6,0.62,px)*smoothstep(0.64,0.62,px);
    float s4x=smoothstep(0.75,0.77,px)*smoothstep(0.95,0.93,px);
    col=mix(col,stripe1+0.1*sin(t),s1x*0.7);
    col=mix(col,stripe2+0.1*cos(t),s2x*0.6);
    col=mix(col,stripe3,s3x*0.5);
    col=mix(col,stripe4+0.1*sin(t*0.7),s4x*0.7);
    float s1y=smoothstep(0.08,0.1,py)*smoothstep(0.35,0.33,py);
    float s2y=smoothstep(0.45,0.47,py)*smoothstep(0.55,0.53,py);
    float s3y=smoothstep(0.6,0.62,py)*smoothstep(0.64,0.62,py);
    float s4y=smoothstep(0.75,0.77,py)*smoothstep(0.95,0.93,py);
    col=mix(col,mix(col,stripe1,0.5),s1y*0.7);
    col=mix(col,mix(col,stripe2,0.5),s2y*0.6);
    col=mix(col,mix(col,stripe3,0.5),s3y*0.5);
    col=mix(col,mix(col,stripe4,0.5),s4y*0.7);
    float weave=sin(p.x*40.0)*sin(p.y*40.0)*0.03;
    col+=weave;
    return float4(col,1.0);
}
