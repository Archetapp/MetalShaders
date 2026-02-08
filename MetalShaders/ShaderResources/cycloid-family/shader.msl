#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 cycloidFamilyFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.06);float R=0.2;float r1=0.08+0.03*sin(t*0.3);
    for(float s=0.0;s<500.0;s+=1.0){float param=s*0.013;
        float2 epiPos=float2((R+r1)*cos(param)-r1*cos((R+r1)/r1*param),(R+r1)*sin(param)-r1*sin((R+r1)/r1*param)+0.2);
        float d=length(uv-epiPos);float3 c=0.5+0.5*cos(6.28*(param*0.05+t*0.1+float3(0,0.33,0.67)));
        col+=c*smoothstep(0.004,0.001,d)*0.1+c*0.0002/(d+0.002)*0.2;}
    float r2=0.12+0.04*cos(t*0.4);
    for(float s=0.0;s<500.0;s+=1.0){float param=s*0.013;
        float2 hypoPos=float2((R-r2)*cos(param)+r2*cos((R-r2)/r2*param),(R-r2)*sin(param)-r2*sin((R-r2)/r2*param)-0.2);
        float d=length(uv-hypoPos);float3 c=0.5+0.5*cos(6.28*(param*0.05+t*0.1+0.5+float3(0,0.33,0.67)));
        col+=c*smoothstep(0.004,0.001,d)*0.1+c*0.0002/(d+0.002)*0.2;}
    return float4(col,1.0);}
