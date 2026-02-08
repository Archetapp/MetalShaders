#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float fmNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float fmFbm(float2 p){float v=0.0;float a=0.5;for(int i=0;i<6;i++){v+=a*fmNoise(p);p*=2.0;a*=0.5;}return v;}

fragment float4 fogMistFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.1;
    float3 bg=mix(float3(0.15,0.18,0.12),float3(0.3,0.35,0.25),uv.y);
    float treeNoise=fmNoise(float2(uv.x*10.0,0.0));
    float treeH=0.35+treeNoise*0.15;
    float treeSil=smoothstep(treeH,treeH+0.01,uv.y)*(1.0-smoothstep(treeH+0.15,treeH+0.3,uv.y));
    bg=mix(bg,float3(0.05,0.08,0.03),treeSil*0.8);
    float3 col=bg;
    for(int i=0;i<5;i++){
        float fi=float(i);
        float speed=0.05+fi*0.02;
        float scale=2.0+fi*0.5;
        float density=0.3+fi*0.1;
        float fog=fmFbm(float2(uv.x*scale+t*speed+fi*3.0,uv.y*scale*0.5+fi*2.0));
        float mask=smoothstep(0.3,0.6,fog);
        float heightFade=smoothstep(0.0,0.3+fi*0.1,uv.y)*smoothstep(0.8,0.5-fi*0.05,uv.y);
        float depth=1.0-fi*0.15;
        float3 fogCol=float3(0.7,0.75,0.8)*depth;
        col=mix(col,fogCol,mask*heightFade*density);
    }
    float ground=smoothstep(0.15,0.0,uv.y);
    col=mix(col,float3(0.1,0.12,0.08),ground);
    return float4(col,1.0);
}
