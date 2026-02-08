#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float ceHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float2 ceRandom(float2 p){return float2(ceHash(p),ceHash(p+float2(37.0,71.0)));}
float ceNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(ceHash(i),ceHash(i+float2(1,0)),f.x),mix(ceHash(i+float2(0,1)),ceHash(i+float2(1,1)),f.x),f.y);}
fragment float4 crackedEarthFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float scale=8.0;float2 p=uv*scale;
    float minD=10.0,secD=10.0;float2 closest=float2(0.0);
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        float2 cell=floor(p)+float2(float(x),float(y));
        float2 pt=cell+ceRandom(cell)*0.8+0.1;float d=length(p-pt);
        if(d<minD){secD=minD;minD=d;closest=cell;}else if(d<secD){secD=d;}}
    float crack=secD-minD;float crackLine=1.0-smoothstep(0.0,0.06,crack);float deepCrack=1.0-smoothstep(0.0,0.02,crack);
    float n=ceNoise(uv*20.0)*0.1+ceNoise(uv*40.0)*0.05;
    float3 mudLight=float3(0.55,0.42,0.28);float3 mudDark=float3(0.35,0.25,0.15);float3 crackCol=float3(0.12,0.08,0.05);
    float3 col=mix(mudDark,mudLight,ceHash(closest)*0.5+0.25+n);
    col=mix(col,crackCol,crackLine);col=mix(col,crackCol*0.5,deepCrack);
    col*=0.7+max(0.0,1.0-length(uv-float2(0.5+0.1*sin(t*0.3),0.6))*1.5)*0.4;
    return float4(col,1.0);}
