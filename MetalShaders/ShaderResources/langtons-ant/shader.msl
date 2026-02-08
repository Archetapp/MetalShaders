#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float laHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 langtonsAntFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float gridSize = 64.0;
    float2 cell = floor(uv * gridSize);
    float2 cellUv = fract(uv * gridSize);
    float steps = floor(t * 30.0);
    float pattern = 0.0;
    float dx = cell.x - 32.0;
    float dy = cell.y - 32.0;
    float angle = atan2(dy, dx) + t*0.2;
    float radius = length(float2(dx, dy));
    float highway = sin(angle*4.0 + radius*0.5 - t*2.0)*0.5+0.5;
    highway *= exp(-radius*0.03);
    float timeLayer = sin(cell.x*0.3+t)*sin(cell.y*0.3+t*1.3)*0.5+0.5;
    pattern = mix(highway, timeLayer, 0.3);
    float3 col = float3(0.0);
    float3 onCol = float3(0.1, 0.6, 0.9);
    float3 offCol = float3(0.05, 0.05, 0.1);
    col = mix(offCol, onCol, pattern);
    float border = step(cellUv.x, 0.05)+step(cellUv.y, 0.05);
    border = min(border, 1.0);
    col = mix(col, col*0.7, border*0.3);
    float antDist = length(cell - float2(32.0+10.0*sin(t), 32.0+10.0*cos(t*0.7)));
    float ant = smoothstep(2.0, 0.0, antDist);
    col += float3(1.0, 0.3, 0.1)*ant;
    return float4(col, 1.0);
}
