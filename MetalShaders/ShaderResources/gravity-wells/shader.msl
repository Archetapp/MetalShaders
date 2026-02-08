#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float gravityWellHash(float n) { return fract(sin(n)*43758.5453); }

fragment float4 gravityWellsFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float2 wells[3];
    wells[0] = float2(sin(iTime*0.3)*0.25, cos(iTime*0.4)*0.2);
    wells[1] = float2(sin(iTime*0.4+2.0)*0.3, cos(iTime*0.3+1.0)*0.25);
    wells[2] = float2(sin(iTime*0.25+4.0)*0.2, cos(iTime*0.35+3.0)*0.3);
    float3 col = float3(0.01,0.01,0.02);
    float3 wellColors[3] = {float3(0.3,0.1,0.5), float3(0.1,0.3,0.5), float3(0.5,0.2,0.1)};
    for (int w = 0; w < 3; w++) {
        float wd = length(uv-wells[w]);
        col += wellColors[w]*0.01/(wd*wd+0.01)*0.02;
        col += abs(sin(wd*30.0-iTime)*exp(-wd*3.0)*0.03)*wellColors[w]*0.5;
    }
    for (int i = 0; i < 60; i++) {
        float fi = float(i), seed = fi*1.618;
        float2 pos = float2(gravityWellHash(seed)-0.5, gravityWellHash(seed+100.0)-0.5)*0.8;
        float2 vel = float2(gravityWellHash(seed+200.0)-0.5, gravityWellHash(seed+300.0)-0.5)*0.3;
        for (int s = 0; s < 20; s++) {
            float2 accel = float2(0.0);
            for (int w = 0; w < 3; w++) {
                float2 tw = wells[w]-pos; float d = max(length(tw),0.02);
                accel += normalize(tw)*0.001/(d*d);
            }
            vel = (vel+accel)*0.99; pos += vel*0.05;
        }
        float pd = length(uv-pos);
        float3 pc = 0.5+0.5*cos(6.28*(gravityWellHash(seed+400.0)+float3(0,0.33,0.67)));
        col += pc*exp(-pd*100.0)*0.5 + float3(1.0)*exp(-pd*300.0);
    }
    col = pow(col, float3(0.85));
    return float4(col, 1.0);
}
