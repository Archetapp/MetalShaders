#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float2 worleyRandom(float2 p) {
    p = float2(dot(p, float2(127.1, 311.7)), dot(p, float2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float2 worleyCellNoise(float2 p, float t) {
    float2 i = floor(p);
    float2 f = fract(p);
    float f1 = 8.0, f2 = 8.0;
    
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        float2 n = float2(float(x), float(y));
        float2 r = worleyRandom(i + n);
        r = 0.5 + 0.5 * sin(t * 0.8 + 6.2831 * r);
        float d = length(n + r - f);
        if (d < f1) { f2 = f1; f1 = d; }
        else if (d < f2) { f2 = d; }
    }
    return float2(f1, f2);
}

fragment float4 worleyNoiseFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime;
    
    float2 cell = worleyCellNoise(uv * 8.0, t);
    float f1 = cell.x;
    float f2 = cell.y;
    
    float edge = f2 - f1;
    
    float3 col = float3(0.0);
    col += float3(0.1, 0.3, 0.5) * f1 * 2.0;
    col += float3(0.8, 0.4, 0.1) * edge * 1.5;
    col += float3(0.9, 0.9, 0.95) * smoothstep(0.02, 0.0, edge) * 0.5;
    
    return float4(col, 1.0);
}
