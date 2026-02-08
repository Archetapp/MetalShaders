#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 parametricSurfaceFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.06);float maxT=t*0.5;
    for(float s=0.0;s<200.0;s+=1.0){float param=s*0.05;if(param>maxT)break;
        float butterflyR=exp(sin(param))-2.0*cos(4.0*param)+pow(sin((2.0*param-M_PI_F)/24.0),5.0);
        butterflyR*=0.08;float2 pos=float2(sin(param)*butterflyR,cos(param)*butterflyR);
        float d=length(uv-pos);float3 c=0.5+0.5*cos(6.28*(param*0.05+float3(0,0.33,0.67)));
        col+=c*0.001/(d+0.002)*(0.5+0.5*sin(s*0.1))+c*smoothstep(0.005,0.002,d)*0.3;}
    return float4(col,1.0);}
