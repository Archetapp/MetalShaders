#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float sbSphere(float3 p,float r){return length(p)-r;}
float sbBox(float3 p,float3 b){float3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float sbMap(float3 p,float t){
    float mode=fmod(t*0.15,3.0);float s=sbSphere(p,0.8);float b=sbBox(p-float3(0.3*sin(t*0.5)),float3(0.6));
    if(mode<1.0)return min(s,b);if(mode<2.0)return max(s,b);return max(s,-b);}
float3 sbNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(sbMap(p+e.xyy,t)-sbMap(p-e.xyy,t),sbMap(p+e.yxy,t)-sbMap(p-e.yxy,t),sbMap(p+e.yyx,t)-sbMap(p-e.yyx,t)));}
fragment float4 sdfBooleansFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(0,0,3),rd=normalize(float3(uv,-1.5));float d=0.0;
    for(int i=0;i<64;i++){float3 p=ro+rd*d;float h=sbMap(p,t);if(h<0.001||d>10.0)break;d+=h;}
    float3 col=float3(0.05,0.05,0.1);
    if(d<10.0){float3 p=ro+rd*d;float3 n=sbNorm(p,t);float3 light=normalize(float3(1,1,1));
        float diff=max(dot(n,light),0.0);float spec=pow(max(dot(reflect(-light,n),-rd),0.0),32.0);
        float mode=fmod(t*0.15,3.0);
        float3 baseCol=mode<1.0?float3(0.2,0.5,0.8):mode<2.0?float3(0.8,0.3,0.2):float3(0.2,0.8,0.3);
        col=baseCol*(0.2+0.6*diff)+float3(0.8)*spec*0.5;}
    return float4(col,1.0);}
