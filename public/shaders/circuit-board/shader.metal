#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float cbHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 circuitBoardFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float grid = 20.0;
    float2 cell = floor(uv*grid);
    float2 f = fract(uv*grid);
    float id = cbHash(cell);
    float3 pcbGreen = float3(0.0, 0.25, 0.1);
    float3 pcbDark = float3(0.0, 0.15, 0.05);
    float3 col = mix(pcbDark, pcbGreen, 0.5+0.5*cbHash(cell*7.0));
    float traceH = smoothstep(0.04, 0.0, abs(f.y-0.5))*step(0.3, id);
    float traceV = smoothstep(0.04, 0.0, abs(f.x-0.5))*step(0.5, id);
    float trace = max(traceH, traceV);
    float3 copperCol = float3(0.7, 0.5, 0.2);
    float3 solderCol = float3(0.75, 0.75, 0.7);
    col = mix(col, copperCol, trace*0.8);
    float via = smoothstep(0.12, 0.08, length(f-float2(0.5)));
    float viaHole = smoothstep(0.05, 0.07, length(f-float2(0.5)));
    if(id > 0.85){
        col = mix(col, solderCol, via);
        col = mix(col, float3(0.05), (1.0-viaHole)*via);
    }
    if(id > 0.6 && id < 0.7){
        float2 padSize = float2(0.35, 0.2);
        float2 d = abs(f-float2(0.5)) - padSize;
        float pad = smoothstep(0.02, 0.0, max(d.x, d.y));
        col = mix(col, solderCol, pad);
    }
    float pulse = sin(cell.x*0.5+cell.y*0.5+t*3.0)*0.5+0.5;
    float signal = trace * pulse * step(0.8, cbHash(cell+floor(t)));
    col += float3(0.0, 0.5, 0.0)*signal*0.3;
    float2 lp = float2(0.5+0.3*sin(t*0.5), 0.5+0.3*cos(t*0.3));
    float spec = exp(-length(uv-lp)*3.0);
    col += spec*0.1;
    return float4(col, 1.0);
}
