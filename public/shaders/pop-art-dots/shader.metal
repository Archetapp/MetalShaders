#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float padHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 popArtDotsFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float panels=3.0;
    float2 panel=floor(uv*panels);float2 panelUv=fract(uv*panels);
    float panelId=padHash(panel+floor(t*0.1));
    float3 bgCol,dotCol;
    if(panelId>0.8){bgCol=float3(1.0,0.2,0.3);dotCol=float3(1.0,0.8,0.2);}
    else if(panelId>0.6){bgCol=float3(0.1,0.3,0.8);dotCol=float3(1.0);}
    else if(panelId>0.4){bgCol=float3(1.0,0.8,0.0);dotCol=float3(0.9,0.2,0.1);}
    else if(panelId>0.2){bgCol=float3(0.2,0.7,0.3);dotCol=float3(0.05,0.1,0.05);}
    else{bgCol=float3(0.9,0.4,0.7);dotCol=float3(0.2,0.1,0.3);}
    float dotScale=15.0+5.0*sin(t*0.5+panelId*3.0);float2 dotUv=fract(panelUv*dotScale)-0.5;
    float dotSize=0.3+0.1*sin(t+panelId*5.0);
    float3 col=mix(bgCol,dotCol,smoothstep(dotSize,dotSize-0.05,length(dotUv)));
    float border=smoothstep(0.01,0.02,panelUv.x)*smoothstep(0.01,0.02,panelUv.y)*
                 smoothstep(0.99,0.98,panelUv.x)*smoothstep(0.99,0.98,panelUv.y);
    col*=0.8+0.2*border;
    return float4(col,1.0);}
