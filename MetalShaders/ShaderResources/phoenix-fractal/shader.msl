#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 phoenixPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * float3(0.8, 1.0, 0.6) + float3(0.3, 0.1, 0.5)));
}

fragment float4 phoenixFractalFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.8;
    float2 z = uv * zoom;
    float cRe = 0.5667 + sin(iTime * 0.1) * 0.05;
    float p = -0.5 + cos(iTime * 0.08) * 0.05;
    
    float2 zPrev = float2(0.0);
    float iter = 0.0;
    
    for (float i = 0.0; i < 150.0; i++) {
        float2 zNew = float2(
            z.x * z.x - z.y * z.y + cRe + p * zPrev.x,
            2.0 * z.x * z.y + p * zPrev.y
        );
        zPrev = z;
        z = zNew;
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    float3 col;
    if (iter >= 149.0) {
        col = float3(0.02, 0.01, 0.05);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = phoenixPalette(sm * 0.025 + iTime * 0.03);
        col *= 0.8 + 0.2 * sin(sm * 0.5);
    }
    
    return float4(col, 1.0);
}
