#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 magneticFieldFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = (in.uv * iResolution - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float sep = 0.2 + 0.05*sin(t*0.5);
    float2 pole1 = float2(-sep, 0.0);
    float2 pole2 = float2(sep, 0.0);
    float2 d1 = uv - pole1;
    float2 d2 = uv - pole2;
    float r1 = length(d1)+0.001;
    float r2 = length(d2)+0.001;
    float2 B = d1/(r1*r1*r1) - d2/(r2*r2*r2);
    float Bmag = length(B);
    float2 Bdir = B / (Bmag+0.001);
    float angle = atan2(Bdir.y, Bdir.x);
    float lines = sin(angle*8.0 + Bmag*50.0)*0.5+0.5;
    lines = smoothstep(0.3, 0.7, lines);
    float fieldStr = clamp(Bmag*5.0, 0.0, 1.0);
    float3 col = float3(0.02, 0.02, 0.05);
    float3 lineCol = mix(float3(0.1,0.2,0.5), float3(0.3,0.6,1.0), fieldStr);
    col += lineCol * lines * fieldStr;
    float glow1 = 0.005/(r1*r1+0.005);
    float glow2 = 0.005/(r2*r2+0.005);
    col += float3(1.0,0.2,0.2)*glow1;
    col += float3(0.2,0.2,1.0)*glow2;
    float filings = sin(uv.x*200.0+Bdir.x*50.0)*sin(uv.y*200.0+Bdir.y*50.0);
    filings = smoothstep(0.8, 1.0, filings)*fieldStr*0.3;
    col += float3(0.5,0.5,0.6)*filings;
    return float4(col, 1.0);
}
