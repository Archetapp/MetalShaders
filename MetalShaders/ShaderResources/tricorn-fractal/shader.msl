#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 tricornPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * float3(1.0, 0.7, 0.4) + float3(0.0, 0.15, 0.20)));
}

fragment float4 tricornFractalFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.8 + sin(iTime * 0.15) * 0.3;
    float2 c = uv * zoom + float2(-0.3, 0.0);
    float2 z = float2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 150.0; i++) {
        z = float2(z.x, -z.y);
        z = float2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    float3 col;
    if (iter >= 149.0) {
        col = float3(0.02, 0.0, 0.05);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = tricornPalette(sm * 0.03 + iTime * 0.02);
    }
    
    return float4(col, 1.0);
}
