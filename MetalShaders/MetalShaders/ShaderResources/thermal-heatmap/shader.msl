#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float thermalHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float thermalNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(thermalHash(i), thermalHash(i+float2(1,0)), f.x),
               mix(thermalHash(i+float2(0,1)), thermalHash(i+float2(1,1)), f.x), f.y);
}

float thermalFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * thermalNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

float3 thermalPalette(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.25) return mix(float3(0.0, 0.0, 0.2), float3(0.0, 0.0, 0.8), t * 4.0);
    if (t < 0.5) return mix(float3(0.0, 0.0, 0.8), float3(0.0, 0.8, 0.0), (t - 0.25) * 4.0);
    if (t < 0.75) return mix(float3(0.0, 0.8, 0.0), float3(1.0, 1.0, 0.0), (t - 0.5) * 4.0);
    return mix(float3(1.0, 1.0, 0.0), float3(1.0, 0.0, 0.0), (t - 0.75) * 4.0);
}

fragment float4 thermalHeatmapFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.3;
    float heat = thermalFbm(uv * 4.0 + t);
    heat += thermalFbm(uv * 8.0 - t * 0.5) * 0.4;
    heat += sin(uv.x * 3.0 + t) * 0.1;
    heat = heat * 0.7 + 0.15;
    float3 col = thermalPalette(heat);
    float scanline = sin(in.position.y * 2.0) * 0.03;
    col += scanline;
    return float4(col, 1.0);
}
