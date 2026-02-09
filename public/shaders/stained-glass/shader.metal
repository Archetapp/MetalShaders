#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float sgHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float2 sgRandom(float2 p){return float2(sgHash(p),sgHash(p+float2(37.0,71.0)));}
fragment float4 stainedGlassFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float scale=6.0;float2 p=uv*scale;
    float minDist=10.0;float secondDist=10.0;float2 closestCell=float2(0.0);
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        float2 cell=floor(p)+float2(float(x),float(y));
        float2 point=cell+sgRandom(cell)*0.8+0.1;
        float d=length(p-point);
        if(d<minDist){secondDist=minDist;minDist=d;closestCell=cell;}
        else if(d<secondDist){secondDist=d;}}
    float edge=secondDist-minDist;float lead=1.0-smoothstep(0.0,0.08,edge);
    float cellId=sgHash(closestCell);
    float3 glassColors[6]={float3(0.8,0.1,0.1),float3(0.1,0.2,0.8),float3(0.9,0.7,0.1),float3(0.1,0.6,0.2),float3(0.6,0.1,0.6),float3(0.8,0.4,0.1)};
    int idx=min(int(cellId*6.0),5);
    float3 glass=glassColors[idx];
    float light=0.6+0.4*sin(uv.x*M_PI_F+t*0.3)*sin(uv.y*M_PI_F+t*0.21);
    float3 col=glass*light*(1.0-lead*0.8);col=mix(col,float3(0.02),lead);
    col+=glass*exp(-minDist*2.0)*0.2;
    return float4(col,1.0);}
