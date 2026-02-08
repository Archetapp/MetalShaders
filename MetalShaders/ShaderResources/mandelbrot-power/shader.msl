#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float2 cpowN(float2 z, float n) {
    float r = length(z);
    float theta = atan2(z.y, z.x);
    float rn = pow(r, n);
    return float2(rn * cos(n * theta), rn * sin(n * theta));
}

float3 mandelbrotPowerPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * float3(1.0, 0.8, 0.6) + float3(0.0, 0.1, 0.2)));
}

fragment float4 mandelbrotPowerFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float power = 2.0 + fmod(iTime * 0.2, 3.0);
    
    float zoom = 1.5;
    float2 c = uv * zoom;
    float2 z = float2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 100.0; i++) {
        z = cpowN(z, power) + c;
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    float3 col;
    if (iter >= 99.0) {
        col = float3(0.0);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = mandelbrotPowerPalette(sm * 0.03 + power * 0.1);
    }
    
    return float4(col, 1.0);
}
