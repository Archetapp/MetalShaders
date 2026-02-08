#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 simplexPerm(float3 x) { return fmod(((x*34.0)+1.0)*x, 289.0); }

float simplexNoise2D(float2 v) {
    float4 C = float4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    float2 i = floor(v + dot(v, C.yy));
    float2 x0 = v - i + dot(i, C.xx);
    float2 i1 = (x0.x > x0.y) ? float2(1.0, 0.0) : float2(0.0, 1.0);
    float4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = fmod(i, 289.0);
    float3 p = simplexPerm(simplexPerm(i.y + float3(0.0, i1.y, 1.0)) + i.x + float3(0.0, i1.x, 1.0));
    float3 m = max(0.5 - float3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    float3 x = 2.0 * fract(p * C.www) - 1.0;
    float3 h = abs(x) - 0.5;
    float3 ox = floor(x + 0.5);
    float3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    float3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g) * 0.5 + 0.5;
}

fragment float4 simplexNoiseFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.15;
    
    float n = 0.0;
    float amp = 0.5;
    float2 p = uv * 4.0;
    for (int i = 0; i < 6; i++) {
        n += amp * simplexNoise2D(p + t);
        p *= 2.0;
        amp *= 0.5;
        t *= 1.2;
    }
    
    float3 c1 = float3(0.05, 0.1, 0.2);
    float3 c2 = float3(0.2, 0.5, 0.6);
    float3 c3 = float3(0.8, 0.9, 0.7);
    
    float3 col = n < 0.4 ? mix(c1, c2, n * 2.5) : mix(c2, c3, (n - 0.4) * 1.67);
    
    return float4(col, 1.0);
}
