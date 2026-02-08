#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float2 lfRandom2(float2 p){return fract(sin(float2(dot(p,float2(127.1,311.7)),dot(p,float2(269.5,183.3))))*43758.5453);}

float lfVoronoi(float2 p,float time){
    float2 i=floor(p);float2 f=fract(p);
    float minD=1.0;
    for(int x=-1;x<=1;x++){
        for(int y=-1;y<=1;y++){
            float2 neighbor=float2(float(x),float(y));
            float2 point=lfRandom2(i+neighbor);
            point=0.5+0.5*sin(time*0.3+6.2832*point);
            float d=length(neighbor+point-f);
            minD=min(minD,d);
        }
    }
    return minD;
}

fragment float4 lavaFlowFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.2;
    float2 p=uv*4.0+float2(t*0.5,t*0.3);
    float v1=lfVoronoi(p,iTime);
    float v2=lfVoronoi(p*2.0+5.0,iTime);
    float cracks=smoothstep(0.1,0.0,v1)*0.8+smoothstep(0.05,0.0,v2)*0.4;
    float3 crustCol=float3(0.08,0.05,0.04);
    float3 lavaCol=mix(float3(1.0,0.3,0.0),float3(1.0,0.8,0.1),cracks);
    float3 col=mix(crustCol,lavaCol,cracks);
    float heat=smoothstep(0.3,0.0,v1);
    col+=float3(0.3,0.05,0.0)*heat;
    float pulse=0.5+0.5*sin(t*3.0+v1*10.0);
    col+=float3(0.2,0.05,0.0)*pulse*cracks;
    float glow=exp(-v1*5.0)*0.2;
    col+=float3(0.5,0.1,0.0)*glow;
    return float4(col,1.0);
}
