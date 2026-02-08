#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 sunsetScatter(float cosTheta, float height) {
    float3 rayleigh = float3(0.2, 0.5, 1.0);
    float scatter = pow(1.0 - cosTheta, 3.0);
    float3 col = mix(rayleigh, float3(1.0, 0.3, 0.05), scatter);
    col = mix(col, float3(0.6, 0.2, 0.5), height * 0.8);
    return col;
}

fragment float4 atmosphericSunsetFragment(VertexOut in [[stage_in]],
                                           constant float &iTime [[buffer(0)]],
                                           constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.1;
    
    float sunY = 0.25 + sin(t) * 0.1;
    float sunX = 0.5 + cos(t * 0.3) * 0.1;
    float2 sunPos = float2(sunX, sunY);
    
    float height = uv.y;
    float cosTheta = 1.0 - height;
    
    float3 sky = sunsetScatter(cosTheta, height);
    
    float sunDist = length(uv - sunPos);
    float sun = smoothstep(0.06, 0.03, sunDist);
    float sunGlow = exp(-sunDist * 5.0) * 0.8;
    float sunHalo = exp(-sunDist * 2.0) * 0.3;
    
    float3 col = sky * (0.6 + 0.4 * (1.0 - height));
    col += float3(1.0, 0.9, 0.7) * sun;
    col += float3(1.0, 0.5, 0.2) * sunGlow;
    col += float3(0.8, 0.3, 0.4) * sunHalo;
    
    float clouds = sin(uv.x * 10.0 + t * 2.0) * sin(uv.x * 7.0 - t) * 0.5 + 0.5;
    clouds *= smoothstep(0.3, 0.6, uv.y) * smoothstep(0.8, 0.5, uv.y);
    col += clouds * float3(1.0, 0.6, 0.4) * 0.15;
    
    col = pow(col, float3(0.9));
    return float4(col, 1.0);
}
