#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float silkHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float silkNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(silkHash(i), silkHash(i + float2(1,0)), f.x),
               mix(silkHash(i + float2(0,1)), silkHash(i + float2(1,1)), f.x), f.y);
}

float silkFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * silkNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 silkFlowFragment(VertexOut in [[stage_in]],
                                  constant float &iTime [[buffer(0)]],
                                  constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.3;
    
    float flow = silkFbm(float2(uv.x * 8.0 + t, uv.y * 2.0));
    float threadAngle = flow * 6.28318;
    float2 threadDir = float2(cos(threadAngle), sin(threadAngle));
    
    float specular = pow(abs(dot(normalize(float2(1.0, 0.5)), threadDir)), 4.0);
    
    float weave = sin(uv.x * 40.0 + flow * 10.0) * 0.02;
    float warp = silkFbm(uv * 3.0 + t * 0.5);
    
    float3 baseColor = mix(float3(0.6, 0.15, 0.3), float3(0.3, 0.1, 0.5), uv.y + warp * 0.3);
    float3 col = baseColor + specular * float3(1.0, 0.9, 0.95) * 0.6;
    col += weave;
    
    float sheen = pow(abs(sin(uv.x * 20.0 + flow * 5.0 + t)), 8.0) * 0.15;
    col += sheen * float3(1.0, 0.85, 0.9);
    
    return float4(col, 1.0);
}
