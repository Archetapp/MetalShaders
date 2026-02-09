#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float2 newtonCmul(float2 a, float2 b) { return float2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
float2 newtonCdiv(float2 a, float2 b) { float d = dot(b,b) + 1e-10; return float2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/d; }

fragment float4 newtonsFractalFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float zoom = 2.0 + sin(iTime * 0.2) * 0.5;
    float2 z = uv * zoom;
    
    float2 root1 = float2(1.0, 0.0);
    float2 root2 = float2(-0.5, 0.866);
    float2 root3 = float2(-0.5, -0.866);
    
    float iter = 0.0;
    for (float i = 0.0; i < 50.0; i++) {
        float2 z2 = newtonCmul(z, z);
        float2 z3 = newtonCmul(z2, z);
        float2 f = z3 - float2(1.0, 0.0);
        float2 fp = 3.0 * z2;
        z -= newtonCdiv(f, fp);
        iter = i;
        if (dot(f, f) < 0.0001) break;
    }
    
    float d1 = length(z - root1);
    float d2 = length(z - root2);
    float d3 = length(z - root3);
    
    float shade = exp(-iter * 0.1);
    
    float3 col;
    if (d1 < d2 && d1 < d3) col = float3(0.9, 0.2, 0.3) * shade;
    else if (d2 < d3) col = float3(0.2, 0.8, 0.3) * shade;
    else col = float3(0.2, 0.3, 0.9) * shade;
    
    col += 0.1 * shade;
    
    return float4(col, 1.0);
}
