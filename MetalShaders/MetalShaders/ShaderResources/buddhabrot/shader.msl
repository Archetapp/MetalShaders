#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float buddhaHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

fragment float4 buddhabrotFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    uv *= 1.5;
    uv.x -= 0.25;
    
    float density = 0.0;
    float densityR = 0.0;
    float densityG = 0.0;
    float densityB = 0.0;
    
    float t = iTime * 0.1;
    
    for (int s = 0; s < 80; s++) {
        float fs = float(s);
        float2 c = float2(
            buddhaHash(float2(fs * 0.127 + t, fs * 0.319)) * 3.0 - 2.0,
            buddhaHash(float2(fs * 0.419 + t, fs * 0.713)) * 3.0 - 1.5
        );
        
        float2 z = float2(0.0);
        bool escaped = false;
        int escapeIter = 0;
        
        for (int i = 0; i < 60; i++) {
            z = float2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
            if (dot(z, z) > 4.0) { escaped = true; escapeIter = i; break; }
        }
        
        if (escaped) {
            z = float2(0.0);
            for (int i = 0; i < 60; i++) {
                z = float2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
                
                float d = length(uv - z);
                float contribution = exp(-d * d * 100.0);
                
                if (i < 20) densityR += contribution;
                if (i < 40) densityG += contribution;
                densityB += contribution;
                
                if (dot(z, z) > 4.0) break;
            }
        }
    }
    
    float3 col = float3(
        log(1.0 + densityR * 0.3),
        log(1.0 + densityG * 0.2),
        log(1.0 + densityB * 0.15)
    );
    
    col = pow(col, float3(0.7));
    col *= float3(0.8, 0.9, 1.0);
    
    return float4(col, 1.0);
}
