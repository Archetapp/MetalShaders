#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float hmHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 hammeredMetalFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float scale=15.0;float2 p=uv*scale;
    float3 col=float3(0.55,0.45,0.35);
    float2 lightPos=float2(0.5+0.3*sin(t*0.4),0.5+0.3*cos(t*0.3));
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        float2 cell=floor(p)+float2(float(x),float(y));
        float2 center=cell+float2(hmHash(cell),hmHash(cell+float2(1.0)))*0.6+0.2;
        float d=length(p-center);float dimple=smoothstep(0.45,0.0,d);
        float2 normal=normalize(p-center+0.001);
        float2 toLight=normalize(lightPos*scale-p);
        float nDotL=dot(normal,toLight);
        col+=float3(0.3,0.25,0.2)*max(0.0,nDotL*0.5+0.5)*dimple*0.3;
        col+=float3(0.9,0.85,0.7)*pow(max(0.0,nDotL),16.0)*dimple*0.5;
        col-=dimple*0.1;}
    col+=float3(0.4,0.35,0.25)*pow(max(0.0,1.0-length(uv-lightPos)*2.5),8.0);
    return float4(col,1.0);}
