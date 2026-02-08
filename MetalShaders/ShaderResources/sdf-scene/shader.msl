#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float sscSmin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float sscMap(float3 p,float t){float ground=p.y+0.8;
    float s1=length(p-float3(-0.8,0,0))-0.4;float s2=length(p-float3(0.0,0.2*sin(t)+0.1,0))-0.35;
    float s3=length(p-float3(0.8,-0.1,0.3*sin(t*0.7)))-0.3;
    float3 bp=p-float3(0,-0.4,1);float box=length(max(abs(bp)-float3(0.8,0.4,0.1),0.0))-0.05;
    return min(min(sscSmin(sscSmin(s1,s2,0.3),s3,0.2),ground),box);}
float3 sscNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(sscMap(p+e.xyy,t)-sscMap(p-e.xyy,t),sscMap(p+e.yxy,t)-sscMap(p-e.yxy,t),sscMap(p+e.yyx,t)-sscMap(p-e.yyx,t)));}
fragment float4 sdfSceneFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(2.5*sin(t*0.2),1.0,2.5*cos(t*0.2));
    float3 ta=float3(0,-0.2,0);float3 fwd=normalize(ta-ro);float3 right=normalize(cross(fwd,float3(0,1,0)));float3 up=cross(right,fwd);
    float3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<100;i++){float h=sscMap(ro+rd*d,t);if(h<0.001||d>15.0)break;d+=h;}
    float3 col=mix(float3(0.4,0.5,0.7),float3(0.15,0.2,0.4),uv.y+0.5);
    if(d<15.0){float3 p=ro+rd*d;float3 n=sscNorm(p,t);float3 l=normalize(float3(1,1.5,0.5));
        float3 mat=p.y<-0.79?float3(0.4,0.35,0.3):float3(0.5,0.3,0.6);
        col=mat*(0.15+0.6*max(dot(n,l),0.0))*(0.5+0.5*n.y)+float3(0.8)*pow(max(dot(reflect(-l,n),-rd),0.0),32.0)*0.3;
        col=mix(col,float3(0.4,0.5,0.7),1.0-exp(-d*0.1));}
    return float4(col,1.0);}
