#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float sndHash(float3 p){return fract(sin(dot(p,float3(127.1,311.7,74.7)))*43758.5453);}
float sndNoise(float3 p){float3 i=floor(p);float3 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(mix(sndHash(i),sndHash(i+float3(1,0,0)),f.x),
                   mix(sndHash(i+float3(0,1,0)),sndHash(i+float3(1,1,0)),f.x),f.y),
               mix(mix(sndHash(i+float3(0,0,1)),sndHash(i+float3(1,0,1)),f.x),
                   mix(sndHash(i+float3(0,1,1)),sndHash(i+float3(1,1,1)),f.x),f.y),f.z);}
float sndMap(float3 p,float t){return length(p)-0.8+sndNoise(p*3.0+t*0.5)*0.3+sndNoise(p*6.0+t*0.3)*0.15;}
float3 sndNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(sndMap(p+e.xyy,t)-sndMap(p-e.xyy,t),sndMap(p+e.yxy,t)-sndMap(p-e.yxy,t),sndMap(p+e.yyx,t)-sndMap(p-e.yyx,t)));}
fragment float4 sdfNoiseDisplaceFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(0,0,3),rd=normalize(float3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=sndMap(ro+rd*d,t);if(abs(h)<0.001||d>10.0)break;d+=h*0.7;}
    float3 col=float3(0.05,0.05,0.1);
    if(d<10.0){float3 p=ro+rd*d;float3 n=sndNorm(p,t);float3 l=normalize(float3(1,1,1));
        float3 baseCol=0.5+0.5*cos(6.28*(sndNoise(p*2.0)*0.5+t*0.1+float3(0,0.33,0.67)));
        col=baseCol*(0.2+0.5*max(dot(n,l),0.0))+float3(0.8)*pow(max(dot(reflect(-l,n),-rd),0.0),32.0)*0.4+
            float3(0.3,0.4,0.6)*pow(1.0-max(dot(n,-rd),0.0),3.0)*0.3;}
    return float4(col,1.0);}
