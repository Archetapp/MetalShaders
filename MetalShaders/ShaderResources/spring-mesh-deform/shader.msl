#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 springMeshDeformFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float2 pokePos = float2(sin(iTime*0.6)*0.2, cos(iTime*0.5)*0.15);
    float gridSize = 15.0;
    float2 gridUv = uv*gridSize;
    float2 cellId = floor(gridUv);
    float2 cellLocal = fract(gridUv)-0.5;
    float distToPoke = length(cellId/gridSize-pokePos);
    float pokePower = exp(-distToPoke*distToPoke*8.0);
    float wave = sin(distToPoke*20.0-iTime*4.0)*pokePower*0.3;
    float wave2 = sin(distToPoke*15.0-iTime*3.0+1.0)*pokePower*0.15;
    float2 displacement = normalize(cellId/gridSize-pokePos+0.001)*(wave+wave2);
    float jiggle = sin(iTime*8.0+cellId.x*2.0+cellId.y*3.0)*pokePower*0.1;
    displacement += float2(jiggle, jiggle*0.7);
    float2 movedLocal = cellLocal-displacement;
    float nodeSize = 0.08+pokePower*0.04;
    float node = smoothstep(nodeSize, nodeSize*0.5, length(movedLocal));
    float3 col = float3(0.05,0.05,0.08);
    float3 nodeColor = mix(float3(0.2,0.5,0.8), float3(0.8,0.3,0.2), pokePower);
    col = mix(col, nodeColor, node);
    col += node*(wave+wave2)*float3(0.3,0.5,0.8);
    col += exp(-distToPoke*3.0)*0.1*float3(0.2,0.4,0.7);
    return float4(col, 1.0);
}
