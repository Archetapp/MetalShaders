#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 lightSweepGlareFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv*2.0-1.0; centered.x *= iResolution.x/iResolution.y;
    float3 surface = float3(0.15,0.15,0.18);
    surface += sin(centered.x*100.0)*0.01;
    float sweepPos = sin(iTime*0.8)*1.5;
    float sweepLine = centered.x*cos(0.3)+centered.y*sin(0.3)-sweepPos;
    float mainGlare = exp(-sweepLine*sweepLine*20.0);
    float sharpGlare = exp(-sweepLine*sweepLine*200.0);
    float wideGlow = exp(-sweepLine*sweepLine*3.0);
    float anamorphic = exp(-centered.y*centered.y*2.0)*sharpGlare;
    float3 glareColor = float3(1.0,0.95,0.9);
    float3 col = surface + wideGlow*float3(0.1,0.12,0.15)*0.3 + mainGlare*glareColor*0.5 + sharpGlare*glareColor*0.8 + anamorphic*float3(0.5,0.6,0.8)*0.3;
    float specDots=pow(max(sin(centered.x*50.0+sweepPos*10.0)*sin(centered.y*50.0),0.0),8.0);
    col+=specDots*mainGlare*0.3;
    float edge=smoothstep(0.0,0.02,uv.x)*smoothstep(0.0,0.02,uv.y)*smoothstep(0.0,0.02,1.0-uv.x)*smoothstep(0.0,0.02,1.0-uv.y);
    col*=edge;
    return float4(col, 1.0);
}
