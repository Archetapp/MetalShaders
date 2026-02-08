#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 burningShipPalette(float t) {
    t = fract(t);
    float3 a = float3(0.1, 0.0, 0.0);
    float3 b = float3(0.8, 0.2, 0.0);
    float3 c = float3(1.0, 0.8, 0.0);
    float3 d = float3(1.0, 1.0, 0.8);
    
    if (t < 0.33) return mix(a, b, t * 3.0);
    if (t < 0.66) return mix(b, c, (t - 0.33) * 3.0);
    return mix(c, d, (t - 0.66) * 3.0);
}

fragment float4 burningShipFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.5 + sin(iTime * 0.1) * 0.3;
    float2 center = float2(-1.755, -0.03);
    float2 c = uv * zoom + center;
    
    float2 z = float2(0.0);
    float iter = 0.0;
    float maxIter = 200.0;
    
    for (float i = 0.0; i < 200.0; i++) {
        z = float2(abs(z.x), abs(z.y));
        z = float2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    float3 col;
    if (iter >= maxIter - 1.0) {
        col = float3(0.0);
    } else {
        float smooth_iter = iter - log2(log2(dot(z, z))) + 4.0;
        float t = smooth_iter * 0.02 + iTime * 0.05;
        col = burningShipPalette(t);
    }
    
    return float4(col, 1.0);
}
