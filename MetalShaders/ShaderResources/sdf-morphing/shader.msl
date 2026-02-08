#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float smSphere(float3 p,float r){return length(p)-r;}
float smTorus(float3 p,float2 tr){float2 q=float2(length(p.xz)-tr.x,p.y);return length(q)-tr.y;}
float smBox(float3 p,float3 b){float3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float smMap(float3 p,float t){float a=smSphere(p,0.8);float b=smTorus(p,float2(0.6,0.25));float c=smBox(p,float3(0.55));
    float phase=fmod(t*0.2,3.0);
    if(phase<1.0)return mix(a,b,smoothstep(0.0,1.0,fract(phase)));
    if(phase<2.0)return mix(b,c,smoothstep(0.0,1.0,fract(phase)));
    return mix(c,a,smoothstep(0.0,1.0,fract(phase)));}
float3 smNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(smMap(p+e.xyy,t)-smMap(p-e.xyy,t),smMap(p+e.yxy,t)-smMap(p-e.yxy,t),smMap(p+e.yyx,t)-smMap(p-e.yyx,t)));}
fragment float4 sdfMorphingFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(2.0*sin(t*0.3),1.0,2.0*cos(t*0.3)),ta=float3(0);
    float3 fwd=normalize(ta-ro);float3 right=normalize(cross(fwd,float3(0,1,0)));float3 up=cross(right,fwd);
    float3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<80;i++){float h=smMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    float3 col=float3(0.08,0.06,0.12);
    if(d<10.0){float3 p=ro+rd*d;float3 n=smNorm(p,t);float3 l=normalize(float3(1,1,0.5));
        float3 baseCol=0.5+0.5*cos(6.28*(fmod(t*0.2,3.0)/3.0+float3(0,0.33,0.67)));
        col=baseCol*(0.15+0.6*max(dot(n,l),0.0))+float3(0.9)*pow(max(dot(reflect(-l,n),-rd),0.0),32.0)*0.4;}
    return float4(col,1.0);}
