#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 dynamicIslandMorphFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float phase = fmod(iTime*0.5, 4.0);
    float expand = smoothstep(0.0,1.0,phase)-smoothstep(2.0,3.0,phase);
    float split = smoothstep(1.0,2.0,phase)-smoothstep(3.0,4.0,phase);
    float separation = split*0.2;
    float2 pos1 = float2(-separation,0), pos2 = float2(separation,0);
    float w1=0.12+expand*0.08, h1=0.04+expand*0.02, w2=0.06+split*0.04, h2=0.04;
    float2 d1 = abs(uv-pos1)-float2(w1-h1,0); float sdf1 = length(max(d1,0.0))+min(max(d1.x,d1.y),0.0)-h1;
    float2 d2 = abs(uv-pos2)-float2(w2-h2,0); float sdf2 = length(max(d2,0.0))+min(max(d2.x,d2.y),0.0)-h2;
    float k=0.05; float h=clamp(0.5+0.5*(sdf2-sdf1)/k,0.0,1.0);
    float sdf = mix(sdf2,sdf1,h)-k*h*(1.0-h);
    float mask = smoothstep(0.003,-0.003, sdf);
    float3 islandColor = float3(0.1,0.1,0.12)+pow(max(0.0,1.0-abs(uv.y)/0.06),2.0)*0.15;
    float3 bg = float3(0.95,0.93,0.9);
    float3 col = mix(bg, islandColor, mask);
    return float4(col, 1.0);
}
