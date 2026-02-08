#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 waveEquationFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float wave = 0.0;
    for(int i = 0; i < 6; i++){
        float fi = float(i);
        float2 center = float2(0.3 + 0.15*sin(t*0.7+fi*2.0), 0.3 + 0.15*cos(t*0.5+fi*1.5));
        float d = length(uv - center);
        float freq = 15.0 + fi*5.0;
        float speed = 2.0 + fi*0.5;
        wave += sin(d*freq - t*speed)/(1.0 + d*10.0) * 0.3;
    }
    float2 wall = min(uv, 1.0-uv);
    float boundary = smoothstep(0.0, 0.05, wall.x)*smoothstep(0.0, 0.05, wall.y);
    wave *= boundary;
    float reflect = sin(uv.x*M_PI_F*2.0)*sin(uv.y*M_PI_F*2.0);
    wave += reflect*0.05*sin(t*3.0);
    float3 col = float3(0.0);
    col += float3(0.1, 0.3, 0.8) * max(wave, 0.0);
    col += float3(0.0, 0.1, 0.4) * max(-wave, 0.0);
    col += float3(0.02, 0.05, 0.15);
    float crest = smoothstep(0.15, 0.2, wave);
    col += float3(0.5, 0.7, 1.0)*crest*0.5;
    return float4(col, 1.0);
}
