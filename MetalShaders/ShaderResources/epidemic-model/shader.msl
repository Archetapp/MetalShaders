#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float emHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 epidemicModelFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float grid = 50.0;
    float2 cell = floor(uv*grid);
    float2 cellUv = fract(uv*grid);
    float id = emHash(cell);
    float2 infectionCenter = float2(0.5 + 0.2*sin(t*0.3), 0.5 + 0.2*cos(t*0.4));
    float dist = length(cell/grid - infectionCenter);
    float spreadSpeed = 0.15;
    float infectionTime = dist / spreadSpeed;
    float localTime = t - infectionTime + id*0.5;
    float susceptible = smoothstep(0.0, -0.5, localTime);
    float infected = smoothstep(-0.5, 0.0, localTime) * smoothstep(3.0, 2.0, localTime);
    float recovered = smoothstep(2.0, 3.5, localTime);
    float3 susCol = float3(0.2, 0.4, 0.8);
    float3 infCol = float3(0.9, 0.2, 0.1);
    float3 recCol = float3(0.1, 0.7, 0.3);
    float3 col = susCol*susceptible + infCol*infected + recCol*recovered;
    float person = smoothstep(0.35, 0.3, length(cellUv-float2(0.5)));
    col *= 0.3 + person*0.7;
    float pulse = sin(t*5.0 + dist*20.0)*0.5+0.5;
    col += infCol*pulse*infected*0.2;
    float border = smoothstep(0.0, 0.05, cellUv.x)*smoothstep(0.0, 0.05, cellUv.y);
    col *= border;
    return float4(col, 1.0);
}
