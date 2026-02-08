#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float2 multibrotPow(float2 z, float n) {
    float r = length(z);
    float theta = atan2(z.y, z.x);
    float rn = pow(r, n);
    return float2(rn * cos(n * theta), rn * sin(n * theta));
}

fragment float4 multibrotFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float section = fmod(iTime * 0.15, 3.0);
    float power;
    if (section < 1.0) power = mix(3.0, 4.0, section);
    else if (section < 2.0) power = mix(4.0, 5.0, section - 1.0);
    else power = mix(5.0, 3.0, section - 2.0);
    
    float zoom = 1.3;
    float2 c = uv * zoom;
    float2 z = float2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 150.0; i++) {
        z = multibrotPow(z, power) + c;
        if (dot(z, z) > 256.0) { iter = i; break; }
        iter = i;
    }
    
    float3 col;
    if (iter >= 149.0) {
        col = float3(0.01, 0.01, 0.02);
    } else {
        float sm = iter - log(log(dot(z, z)) / log(256.0)) / log(power);
        float t = sm * 0.02;
        
        col = float3(
            0.5 + 0.5 * sin(t * 5.0 + 0.0),
            0.5 + 0.5 * sin(t * 5.0 + 2.1),
            0.5 + 0.5 * sin(t * 5.0 + 4.2)
        );
        col *= 0.8 + 0.2 * sin(power * M_PI_F);
    }
    
    return float4(col, 1.0);
}
