#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 pendulumPhaseFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = (in.uv * iResolution - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float3 col = float3(0.02, 0.02, 0.05);
    float th1 = 1.5*sin(t*1.1) + 0.8*sin(t*2.7);
    float th2 = 2.0*sin(t*1.7) + 1.0*sin(t*3.1);
    float l1 = 0.15, l2 = 0.12;
    float2 p1 = float2(sin(th1), -cos(th1))*l1;
    float2 p2 = p1 + float2(sin(th2), -cos(th2))*l2;
    float pivot = smoothstep(0.008, 0.004, length(uv));
    col += float3(0.5)*pivot;
    float joint1 = smoothstep(0.008, 0.004, length(uv-p1));
    col += float3(0.3, 0.5, 0.8)*joint1;
    float joint2 = smoothstep(0.008, 0.004, length(uv-p2));
    col += float3(0.8, 0.3, 0.3)*joint2;
    float lineW = 0.002;
    for(float s = 0.0; s < 1.0; s += 0.02){
        float2 lp = mix(float2(0.0), p1, s);
        float d = length(uv-lp);
        col += float3(0.2, 0.3, 0.5)*smoothstep(lineW, 0.0, d)*0.5;
    }
    for(float s = 0.0; s < 1.0; s += 0.02){
        float2 lp = mix(p1, p2, s);
        float d = length(uv-lp);
        col += float3(0.5, 0.2, 0.3)*smoothstep(lineW, 0.0, d)*0.5;
    }
    for(int i = 0; i < 80; i++){
        float ti = t - float(i)*0.02;
        float a1 = 1.5*sin(ti*1.1)+0.8*sin(ti*2.7);
        float a2 = 2.0*sin(ti*1.7)+1.0*sin(ti*3.1);
        float2 tp = float2(sin(a1),-cos(a1))*l1 + float2(sin(a2),-cos(a2))*l2;
        float d = length(uv - tp);
        float alpha = 1.0 - float(i)/80.0;
        float hue = float(i)/80.0;
        float3 tc = 0.5+0.5*cos(6.28*(hue+float3(0.0,0.33,0.67)));
        col += tc*0.003/(d+0.003)*alpha;
    }
    return float4(col, 1.0);
}
