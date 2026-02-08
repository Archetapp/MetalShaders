#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float gyGyroid(float3 p){return sin(p.x)*cos(p.y)+sin(p.y)*cos(p.z)+sin(p.z)*cos(p.x);}
float gyMap(float3 p,float t){float scale=3.0+sin(t*0.3);return abs(gyGyroid(p*scale))/scale-0.03;}
float3 gyNorm(float3 p,float t){float2 e=float2(0.001,0.0);
    return normalize(float3(gyMap(p+e.xyy,t)-gyMap(p-e.xyy,t),gyMap(p+e.yxy,t)-gyMap(p-e.yxy,t),gyMap(p+e.yyx,t)-gyMap(p-e.yyx,t)));}
fragment float4 gyroidSurfaceFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 ro=float3(2.0*sin(t*0.3),sin(t*0.2),2.0*cos(t*0.3));
    float3 ta=float3(0);float3 fwd=normalize(ta-ro);float3 right=normalize(cross(fwd,float3(0,1,0)));float3 up=cross(right,fwd);
    float3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<100;i++){float h=gyMap(ro+rd*d,t);if(abs(h)<0.001||d>8.0)break;d+=h*0.5;}
    float3 col=float3(0.05,0.02,0.08);
    if(d<8.0){float3 p=ro+rd*d;float3 n=gyNorm(p,t);float3 l=normalize(float3(1,1,0.5));
        float3 matCol=0.5+0.5*cos(6.28*(p*0.3+float3(0,0.33,0.67)+t*0.1));
        col=matCol*(0.15+0.5*max(dot(n,l),0.0))+float3(0.8)*pow(max(dot(reflect(-l,n),-rd),0.0),32.0)*0.3+
            float3(0.3,0.2,0.5)*pow(1.0-abs(dot(n,-rd)),3.0)*0.4;
        col*=exp(-d*0.15);}
    return float4(col,1.0);}
