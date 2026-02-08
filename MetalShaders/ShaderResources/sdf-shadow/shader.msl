#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float sshMap(float3 p,float t){float plane=p.y+0.5;
    float sphere=length(p-float3(0,0.3*sin(t)+0.2,0))-0.5;
    float box=length(max(abs(p-float3(1.0,0,0.5*sin(t*0.7)))-float3(0.3),0.0));
    return min(plane,min(sphere,box));}
float sshSoftShadow(float3 ro,float3 rd,float mint,float maxt,float k,float t){
    float res=1.0;float d=mint;
    for(int i=0;i<32;i++){float h=sshMap(ro+rd*d,t);res=min(res,k*h/d);d+=clamp(h,0.02,0.2);if(h<0.001||d>maxt)break;}
    return clamp(res,0.0,1.0);}
float3 sshNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(sshMap(p+e.xyy,t)-sshMap(p-e.xyy,t),sshMap(p+e.yxy,t)-sshMap(p-e.yxy,t),sshMap(p+e.yyx,t)-sshMap(p-e.yyx,t)));}
fragment float4 sdfShadowFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(0,1.5,3),rd=normalize(float3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=sshMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    float3 col=float3(0.4,0.5,0.7);
    if(d<10.0){float3 p=ro+rd*d;float3 n=sshNorm(p,t);
        float3 light=normalize(float3(sin(t*0.3),1.5,cos(t*0.4)));
        float diff=max(dot(n,light),0.0);float shadow=sshSoftShadow(p+n*0.01,light,0.02,5.0,16.0,t);
        col=float3(0.6,0.55,0.5)*(0.1+0.6*diff*shadow)*(0.5+0.5*n.y);
        if(p.y>-0.49)col=mix(col,float3(0.3,0.5,0.7),0.3);}
    return float4(col,1.0);}
