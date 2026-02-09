#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float ffHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float ffNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(ffHash(i),ffHash(i+float2(1,0)),f.x),mix(ffHash(i+float2(0,1)),ffHash(i+float2(1,1)),f.x),f.y);}

fragment float4 forestFireFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float grid = 40.0;
    float2 cell = floor(uv*grid);
    float2 cellUv = fract(uv*grid);
    float cellH = ffHash(cell);
    float fireWave = sin(cell.x*0.15 - t*1.5 + sin(cell.y*0.2)*2.0)*0.5+0.5;
    float spreadNoise = ffNoise(cell*0.1 + t*0.3);
    float fireProb = fireWave * spreadNoise;
    float isBurning = smoothstep(0.4, 0.6, fireProb);
    float burnPhase = fract(fireProb*3.0 + t*0.5 + cellH);
    float3 treeCol = mix(float3(0.05, 0.25, 0.05), float3(0.1, 0.4, 0.1), cellH);
    float3 fireCol = mix(float3(1.0, 0.3, 0.0), float3(1.0, 0.8, 0.1), burnPhase);
    float3 ashCol = float3(0.15, 0.1, 0.08);
    float burnedOut = smoothstep(0.7, 1.0, fireProb + spreadNoise*0.3);
    float3 col = treeCol;
    col = mix(col, fireCol, isBurning*(1.0-burnedOut));
    col = mix(col, ashCol, burnedOut*isBurning);
    float treeTrunk = smoothstep(0.1, 0.0, abs(cellUv.x-0.5)) * step(0.0, cellUv.y) * step(cellUv.y, 0.4);
    float treeTop = smoothstep(0.35, 0.0, length(cellUv - float2(0.5, 0.6)));
    float tree = max(treeTrunk*0.5, treeTop)*(1.0-burnedOut*isBurning);
    col *= 0.5 + tree*0.5;
    float flicker = ffHash(cell+floor(t*10.0))*0.3;
    col += fireCol*flicker*isBurning*(1.0-burnedOut)*0.5;
    return float4(col, 1.0);
}
