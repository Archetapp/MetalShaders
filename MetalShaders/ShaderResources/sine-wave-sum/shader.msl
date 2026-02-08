#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 sineWaveSumFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.03,0.08);float sum=0.0;
    for(int i=0;i<7;i++){float fi=float(i);
        float freq=1.0+fi*0.7;float amp=0.15/(1.0+fi*0.3);float phase=t*(0.5+fi*0.2)+fi*0.5;
        float wave=sin(uv.x*freq*6.28+phase)*amp;sum+=wave;
        float wd=abs(uv.y-wave);float3 wc=0.5+0.5*cos(6.28*(fi/7.0+float3(0,0.33,0.67)));
        col+=wc*smoothstep(0.008,0.0,wd)*0.4+wc*0.002/(wd+0.002)*0.1;}
    float sumDist=abs(uv.y-sum);col+=float3(1.0,0.9,0.5)*smoothstep(0.005,0.0,sumDist);
    col+=float3(1.0,0.9,0.5)*0.003/(sumDist+0.003)*0.3;
    col+=float3(0.15)*(smoothstep(0.002,0.0,abs(uv.y))+smoothstep(0.002,0.0,abs(uv.x)));
    return float4(col,1.0);}
