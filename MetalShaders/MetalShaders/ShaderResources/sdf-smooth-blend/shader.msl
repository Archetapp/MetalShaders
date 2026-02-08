#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float ssbSmin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float ssbMap(float3 p,float t){float d=1e10;
    for(int i=0;i<4;i++){float fi=float(i);
        float3 offset=float3(sin(t*0.5+fi*1.57),cos(t*0.3+fi*2.0),sin(t*0.7+fi*1.3))*0.7;
        d=ssbSmin(d,length(p-offset)-0.4,0.5+0.3*sin(t*0.2));}return d;}
float3 ssbNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(ssbMap(p+e.xyy,t)-ssbMap(p-e.xyy,t),ssbMap(p+e.yxy,t)-ssbMap(p-e.yxy,t),ssbMap(p+e.yyx,t)-ssbMap(p-e.yyx,t)));}
fragment float4 sdfSmoothBlendFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(0,0,3.5),rd=normalize(float3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=ssbMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    float3 col=float3(0.1,0.05,0.15);
    if(d<10.0){float3 p=ro+rd*d;float3 n=ssbNorm(p,t);
        float3 light=normalize(float3(sin(t*0.3),1,cos(t*0.4)));
        float diff=max(dot(n,light),0.0);float spec=pow(max(dot(reflect(-light,n),-rd),0.0),64.0);
        float fresnel=pow(1.0-max(dot(n,-rd),0.0),3.0);
        col=float3(0.3,0.1,0.5)*(0.2+0.5*diff)+float3(0.5,0.3,0.8)*fresnel*0.5+float3(1.0)*spec*0.4;}
    return float4(col,1.0);}
