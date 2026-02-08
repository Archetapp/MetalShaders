#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float leatherHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float leatherNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(leatherHash(i), leatherHash(i+float2(1,0)), f.x),
               mix(leatherHash(i+float2(0,1)), leatherHash(i+float2(1,1)), f.x), f.y);
}

float leatherVoronoi(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    float md = 1.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        float2 n = float2(float(x), float(y));
        float2 r = n + leatherHash(i + n + 0.5) * 0.8 - f;
        md = min(md, dot(r, r));
    }
    return sqrt(md);
}

fragment float4 leatherTextureFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.02;
    
    float largeBump = leatherVoronoi(uv * 8.0 + t);
    float medBump = leatherVoronoi(uv * 20.0 + t * 0.5);
    float pore = leatherNoise(uv * 100.0);
    
    float bump = largeBump * 0.5 + medBump * 0.3 + pore * 0.2;
    
    float3 leather = float3(0.35, 0.2, 0.1);
    float3 highlight = float3(0.5, 0.35, 0.2);
    float3 shadow = float3(0.15, 0.08, 0.04);
    
    float3 col = mix(shadow, leather, smoothstep(0.1, 0.4, bump));
    col = mix(col, highlight, smoothstep(0.5, 0.8, bump));
    
    float specular = pow(max(0.0, bump - 0.5) * 2.0, 4.0) * 0.2;
    col += specular * float3(0.8, 0.7, 0.5);
    
    float grain = leatherNoise(uv * 300.0) * 0.03;
    col += grain;
    
    return float4(col, 1.0);
}
