#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 progressRingFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.12,0.12,0.15);float r=length(uv);float angle=atan2(uv.y,uv.x);
    float progress=fract(t*0.15);float progressAngle=-M_PI_F+progress*2.0*M_PI_F;
    float trackWidth=0.025;float radius=0.2;
    float track=smoothstep(trackWidth,trackWidth-0.003,abs(r-radius));col+=float3(0.15,0.15,0.18)*track;
    float normAngle=fmod(angle+M_PI_F+6.28,6.28)-M_PI_F;
    float fill=smoothstep(progressAngle+0.05,progressAngle-0.05,normAngle)*smoothstep(-M_PI_F-0.05,-M_PI_F+0.05,normAngle)*track;
    float3 fillCol=mix(float3(0.2,0.6,0.9),float3(0.1,0.9,0.5),progress);
    col=mix(col,fillCol,fill);col+=fillCol*fill*0.003/(abs(r-radius)+0.003)*0.3;
    float2 endPos=float2(cos(progressAngle),sin(progressAngle))*radius;
    col=mix(col,fillCol*1.3,smoothstep(0.03,0.02,length(uv-endPos))*fill);
    return float4(col,1.0);}
