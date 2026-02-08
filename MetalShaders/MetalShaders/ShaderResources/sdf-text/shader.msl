#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float stBox(float2 p,float2 b){float2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float stChar(float2 p,int c){float d=1e5;
    if(c==0){d=min(d,abs(length(p-float2(0,0.1))-0.2)-0.04);
        d=min(d,stBox(p-float2(-0.18,-0.15),float2(0.04,0.15)));
        d=min(d,stBox(p-float2(0.18,-0.15),float2(0.04,0.15)));}
    else if(c==1){d=min(d,stBox(p,float2(0.04,0.3)));
        d=min(d,stBox(p-float2(0,0.3),float2(0.15,0.04)));
        d=min(d,stBox(p-float2(0,-0.3),float2(0.15,0.04)));}
    else if(c==2){d=min(d,stBox(p-float2(-0.15,0),float2(0.04,0.3)));
        d=min(d,stBox(p-float2(0.15,0),float2(0.04,0.3)));
        d=min(d,stBox(p-float2(0,0.0),float2(0.15,0.04)));}
    return d;}
fragment float4 sdfTextFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.05,0.05,0.1);float totalD=1e5;
    for(int i=0;i<3;i++){float fi=float(i);
        totalD=min(totalD,stChar(uv-float2(-0.4+fi*0.4,0.05*sin(t*2.0+fi)),i));}
    float3 glowCol=0.5+0.5*cos(6.28*(fract(t*0.1)+float3(0,0.33,0.67)));
    col+=glowCol*0.01/(totalD+0.01)*0.5;col+=float3(0.9)*smoothstep(0.01,0.0,totalD);
    col+=glowCol*(smoothstep(0.06,0.04,totalD)-smoothstep(0.04,0.02,totalD))*0.8;
    return float4(col,1.0);}
