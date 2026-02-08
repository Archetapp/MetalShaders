#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float wxNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 waxSubsurfaceFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float r=length(uv);float2 lightPos=float2(0.2*sin(t*0.5),0.2*cos(t*0.3));
    float lightDist=length(uv-lightPos);
    float sss=exp(-lightDist*3.0)*0.8;float deepScatter=exp(-lightDist*1.5)*0.4;
    float3 waxBase=float3(0.85,0.75,0.55);float3 sssColor=float3(1.0,0.6,0.3);float3 deepColor=float3(0.8,0.2,0.1);
    float3 col=waxBase*0.3;col+=sssColor*sss;col+=deepColor*deepScatter;
    col+=wxNoise(uv*10.0+t*0.1)*0.1*waxBase;
    col=mix(col,col*0.5,pow(smoothstep(0.0,0.45,r),2.0));
    col+=float3(1.0,0.95,0.85)*pow(max(0.0,1.0-lightDist*4.0),16.0)*0.5;
    col*=1.0-smoothstep(0.4,0.42,r);
    col+=sssColor*smoothstep(0.35,0.4,r)*smoothstep(0.42,0.4,r)*0.5;
    return float4(col,1.0);}
