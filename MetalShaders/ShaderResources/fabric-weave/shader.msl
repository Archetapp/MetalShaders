#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float weaveHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float weaveNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(weaveHash(i), weaveHash(i+float2(1,0)), f.x),
               mix(weaveHash(i+float2(0,1)), weaveHash(i+float2(1,1)), f.x), f.y);
}

fragment float4 fabricWeaveFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.1;
    
    float scale = 20.0;
    float2 grid = uv * scale;
    float2 cell = floor(grid);
    float2 local = fract(grid);
    
    float checkerboard = fmod(cell.x + cell.y, 2.0);
    
    float warpThread = smoothstep(0.0, 0.15, local.y) * smoothstep(1.0, 0.85, local.y);
    float weftThread = smoothstep(0.0, 0.15, local.x) * smoothstep(1.0, 0.85, local.x);
    
    float threadNoise = weaveNoise(cell * 0.5 + t) * 0.15;
    
    float thread;
    if (checkerboard > 0.5) {
        thread = warpThread * (0.7 + weftThread * 0.3);
    } else {
        thread = weftThread * (0.7 + warpThread * 0.3);
    }
    
    float3 warpColor = float3(0.3, 0.15, 0.5) + threadNoise;
    float3 weftColor = float3(0.5, 0.35, 0.2) + threadNoise;
    
    float3 col = mix(warpColor, weftColor, checkerboard) * thread;
    
    float shadow = 1.0 - (1.0 - thread) * 0.3;
    col *= shadow;
    
    float fuzz = weaveNoise(uv * 200.0) * 0.04;
    col += fuzz;
    
    return float4(col, 1.0);
}
