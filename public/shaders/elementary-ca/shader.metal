#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 elementaryCaFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float cols = floor(iResolution.x / 2.0);
    float row = floor((1.0 - uv.y + fract(t*0.2)) * cols);
    float col_idx = floor(uv.x * cols);
    float pattern = sin(col_idx*0.2 + row*0.3)*sin(row*0.1 - t);
    float cellState = step(0.0, pattern);
    float2 cellUv = fract(float2(uv.x*cols, (1.0-uv.y+fract(t*0.2))*cols));
    float border = smoothstep(0.0, 0.1, cellUv.x)*smoothstep(0.0, 0.1, cellUv.y);
    float3 onColor = 0.5+0.5*cos(6.28*(row*0.01+t*0.1+float3(0.0,0.33,0.67)));
    float3 offColor = float3(0.05, 0.05, 0.08);
    float3 finalCol = mix(offColor, onColor, cellState);
    finalCol *= border;
    return float4(finalCol, 1.0);
}
