#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 springMeshFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float gridSize = 20.0;
    float2 cell = floor(uv * gridSize);
    float2 cellUv = fract(uv * gridSize);
    float3 col = float3(0.02, 0.03, 0.08);
    float2 disturb = float2(0.5 + 0.3*sin(t*0.7), 0.5 + 0.3*cos(t*0.5));
    float dist = length(cell/gridSize - disturb);
    float displacement = sin(dist*15.0 - t*4.0) * exp(-dist*3.0) * 0.3;
    float2 offset = normalize(cell/gridSize - disturb + 0.001) * displacement;
    float2 nodePos = cellUv - 0.5 + offset;
    float node = smoothstep(0.12, 0.08, length(nodePos));
    float hue = dist*2.0 + t*0.2;
    float3 nodeCol = 0.5+0.5*cos(6.28*(hue+float3(0.0,0.33,0.67)));
    col += nodeCol * node * 0.8;
    float lineH = smoothstep(0.02, 0.0, abs(nodePos.y)) * step(abs(nodePos.x), 0.5);
    float lineV = smoothstep(0.02, 0.0, abs(nodePos.x)) * step(abs(nodePos.y), 0.5);
    col += nodeCol * (lineH+lineV) * 0.3;
    float glow = 0.01/(length(nodePos)*length(nodePos)+0.01);
    col += nodeCol * glow * 0.02;
    return float4(col, 1.0);
}
