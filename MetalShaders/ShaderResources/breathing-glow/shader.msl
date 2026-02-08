#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 breathingGlowFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.04);float r=length(uv);float angle=atan2(uv.y,uv.x);
    float breathe=sin(t*1.5)*0.3+0.7;float radius=0.2*breathe;float ringWidth=0.02+0.01*sin(t*3.0);
    float ring=max(smoothstep(ringWidth,0.0,abs(r-radius)),
                   smoothstep(ringWidth,0.0,abs(r-radius+sin(angle*6.0+t*2.0)*0.005))*0.7);
    float hue=fract(t*0.1);
    float3 glowCol1=0.5+0.5*cos(6.28*(hue+float3(0,0.33,0.67)));
    float3 glowCol2=0.5+0.5*cos(6.28*(hue+0.3+float3(0,0.33,0.67)));
    float3 ringCol=mix(glowCol1,glowCol2,sin(angle*2.0+t)*0.5+0.5);
    col+=ringCol*ring+ringCol*0.01/(abs(r-radius)+0.01)*breathe*0.15+ringCol*exp(-r*r*30.0/breathe)*0.1*breathe;
    for(int i=1;i<=3;i++){col+=ringCol*smoothstep(0.005,0.0,abs(r-(radius+float(i)*0.04*breathe)))*(0.3/float(i));}
    return float4(col,1.0);}
