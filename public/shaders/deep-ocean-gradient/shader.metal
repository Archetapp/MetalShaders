#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float oceanCaustic(float2 uv, float t) {
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float2 p = uv * (2.0 + fi) + t * (0.3 + fi * 0.1);
        c += sin(p.x * M_PI_F + sin(p.y * 2.5 + t)) * 0.33;
    }
    return pow(abs(c), 2.0);
}

fragment float4 deepOceanGradientFragment(VertexOut in [[stage_in]],
                                           constant float &iTime [[buffer(0)]],
                                           constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.5;
    float depth = 1.0 - uv.y;
    
    float3 shallow = float3(0.0, 0.8, 0.7);
    float3 mid = float3(0.0, 0.3, 0.6);
    float3 deep = float3(0.0, 0.05, 0.15);
    
    float3 col = depth < 0.5 ? mix(shallow, mid, depth * 2.0) : mix(mid, deep, (depth - 0.5) * 2.0);
    
    float caustic = oceanCaustic(uv * 3.0, t);
    float causticFade = (1.0 - depth) * (1.0 - depth);
    col += caustic * causticFade * float3(0.2, 0.6, 0.5) * 0.5;
    
    float particles = sin(uv.x * 50.0 + t * 3.0) * sin(uv.y * 50.0 + t * 2.0);
    particles = smoothstep(0.95, 1.0, particles);
    col += particles * (1.0 - depth) * float3(0.3, 0.6, 0.5) * 0.3;
    
    float rays = max(0.0, sin(uv.x * 5.0 + sin(uv.y * 2.0 + t) * 0.5));
    rays = pow(rays, 4.0) * (1.0 - depth) * 0.15;
    col += rays * float3(0.3, 0.7, 0.6);
    
    return float4(col, 1.0);
}
