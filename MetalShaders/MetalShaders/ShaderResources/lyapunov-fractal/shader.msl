#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 lyapunovFractalFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    
    float pan = sin(iTime * 0.1) * 0.3;
    float a = mix(2.0, 4.0, uv.x) + pan;
    float b = mix(2.0, 4.0, uv.y) + pan;
    
    float x = 0.5;
    float lyap = 0.0;
    int seq[12] = {0,1,0,1,1,0,0,1,0,1,1,0};
    
    for (int n = 0; n < 120; n++) {
        float r = (seq[n % 12] == 0) ? a : b;
        x = r * x * (1.0 - x);
        if (n > 20) {
            float deriv = abs(r * (1.0 - 2.0 * x));
            if (deriv > 0.0) lyap += log(deriv);
        }
    }
    lyap /= 100.0;
    
    float3 col;
    if (lyap < 0.0) {
        float t = clamp(-lyap * 2.0, 0.0, 1.0);
        col = mix(float3(0.0, 0.0, 0.2), float3(0.0, 0.5, 1.0), t);
    } else {
        float t = clamp(lyap * 3.0, 0.0, 1.0);
        col = mix(float3(0.2, 0.0, 0.0), float3(1.0, 0.8, 0.0), t);
    }
    
    return float4(col, 1.0);
}
