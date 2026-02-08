#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float srMap(float3 p,float t){float rep=2.0;float3 q=p-rep*floor(p/rep+0.5);
    return length(q)-0.3-0.1*sin(t+p.x*0.5)*sin(p.z*0.5);}
float3 srNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(srMap(p+e.xyy,t)-srMap(p-e.xyy,t),srMap(p+e.yxy,t)-srMap(p-e.yxy,t),srMap(p+e.yyx,t)-srMap(p-e.yyx,t)));}
fragment float4 sdfRepetitionFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(t*0.5,1.0+sin(t*0.3),t*0.3);
    float3 rd=normalize(float3(uv,-1.5));
    float ca=t*0.1,sa=sin(ca),cs=cos(ca);
    rd.xz=float2(rd.x*cs-rd.z*sa,rd.x*sa+rd.z*cs);
    float d=0.0;for(int i=0;i<80;i++){float h=srMap(ro+rd*d,t);if(h<0.001||d>20.0)break;d+=h;}
    float3 col=float3(0.02,0.02,0.05);
    if(d<20.0){float3 p=ro+rd*d;float3 n=srNorm(p,t);float3 l=normalize(float3(1,1,0.5));
        float fog=exp(-d*0.08);float3 id=floor(p/2.0+0.5);
        float3 baseCol=0.5+0.5*cos(6.28*(fract(dot(id,float3(0.1,0.2,0.3)))+float3(0,0.33,0.67)));
        col=(baseCol*(0.2+0.6*max(dot(n,l),0.0))+float3(0.8)*pow(max(dot(reflect(-l,n),-rd),0.0),32.0)*0.3)*fog;}
    return float4(col,1.0);}
