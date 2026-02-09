#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 artDecoFansFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 col=float3(0.05,0.05,0.08);
    float3 gold=float3(0.85,0.7,0.3);float3 darkGold=float3(0.5,0.35,0.1);
    float scale=4.0;float2 cell=floor(uv*scale);float2 f=fract(uv*scale);
    float2 fanCenter=float2(0.5+fmod(cell.y,2.0)*0.5,0.0);float2 fp=f-fanCenter;
    float angle=atan2(fp.y,fp.x);float r=length(fp);
    float fan=smoothstep(0.0,0.01,angle)*smoothstep(M_PI_F,M_PI_F-0.01,angle)*smoothstep(0.8,0.78,r);
    float pattern=mix(sin(angle*8.0+t*0.5)*0.5+0.5,sin(r*20.0-t)*0.5+0.5,0.5);
    col=mix(col,mix(darkGold,gold,pattern),fan);
    float arc=smoothstep(0.005,0.0,abs(r-0.8))*fan;
    for(float ri=0.2;ri<0.8;ri+=0.2){arc+=smoothstep(0.003,0.0,abs(r-ri))*fan*0.5;}
    col+=gold*arc*0.5;
    float rayLines=smoothstep(0.01,0.0,abs(sin(angle*8.0)))*fan*smoothstep(0.1,0.2,r);
    col+=gold*rayLines*0.2;
    return float4(col,1.0);}
