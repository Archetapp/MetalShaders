#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float iridescentHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float iridescentNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = iridescentHash(i);
    float b = iridescentHash(i + float2(1.0, 0.0));
    float c = iridescentHash(i + float2(0.0, 1.0));
    float d = iridescentHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float3 thinFilmColor(float thickness) {
    float r = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.0));
    float g = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.33));
    float b = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.67));
    return float3(r, g, b);
}

fragment float4 iridescentFilmFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float2 center = uv - 0.5;
    float dist = length(center);
    float angle = atan2(center.y, center.x);
    
    float thickness = dist * 3.0 + iTime * 0.3;
    thickness += iridescentNoise(uv * 4.0 + iTime * 0.2) * 0.5;
    thickness += sin(angle * 3.0 + iTime) * 0.2;
    
    float3 col = thinFilmColor(thickness);
    
    float bubble = 1.0 - smoothstep(0.0, 0.5, dist);
    float rim = smoothstep(0.35, 0.5, dist) * (1.0 - smoothstep(0.5, 0.52, dist));
    
    col *= bubble;
    col += rim * float3(1.0) * 0.5;
    
    float highlight = pow(max(0.0, 1.0 - length(center - float2(-0.1, 0.15))), 8.0);
    col += highlight * float3(1.0) * 0.6;
    
    return float4(col, 1.0);
}
