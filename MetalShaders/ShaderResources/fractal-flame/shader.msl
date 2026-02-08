#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float flameHash(float n) { return fract(sin(n) * 43758.5453); }

float2 flameSinusoidal(float2 p) { return sin(p); }

float2 flameSpherical(float2 p) {
    float r2 = dot(p, p) + 0.0001;
    return p / r2;
}

float2 flameSwirl(float2 p) {
    float r2 = dot(p, p);
    float s = sin(r2); float c = cos(r2);
    return float2(p.x * s - p.y * c, p.x * c + p.y * s);
}

float2 flameHorseshoe(float2 p) {
    float r = length(p) + 0.0001;
    return float2((p.x - p.y) * (p.x + p.y), 2.0 * p.x * p.y) / r;
}

fragment float4 fractalFlameFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    
    float density = 0.0;
    float3 colorAccum = float3(0.0);
    
    float2 p = float2(0.1, 0.1);
    float t = iTime * 0.2;
    
    for (int i = 0; i < 150; i++) {
        float fi = float(i);
        float r = flameHash(fi * 7.13 + t * 0.1);
        
        float angle = t * 0.3 + fi * 0.01;
        float2x2 rot = float2x2(cos(angle), -sin(angle), sin(angle), cos(angle));
        
        float2 newP;
        float3 c;
        if (r < 0.25) {
            newP = flameSinusoidal(rot * p * 1.5) * 0.8;
            c = float3(1.0, 0.3, 0.1);
        } else if (r < 0.5) {
            newP = flameSpherical(p + float2(0.5, 0.0)) * 0.7;
            c = float3(0.3, 0.1, 1.0);
        } else if (r < 0.75) {
            newP = flameSwirl(p * 1.2) * 0.6;
            c = float3(0.1, 0.8, 0.3);
        } else {
            newP = flameHorseshoe(p) * 0.7;
            c = float3(1.0, 0.8, 0.1);
        }
        p = newP;
        
        float d = length(uv - p * 0.4);
        float contribution = exp(-d * d * 300.0);
        density += contribution;
        colorAccum += contribution * c;
    }
    
    float logDensity = log(1.0 + density) * 0.5;
    float3 col = colorAccum / (density + 0.001);
    col *= logDensity;
    col = pow(col, float3(0.8));
    
    return float4(col, 1.0);
}
