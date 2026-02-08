#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 carbonFiberFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float scale = 30.0;
    float2 p = uv * scale;
    float2 cell = floor(p);
    float2 f = fract(p);
    float twill = fmod(cell.x + cell.y, 2.0);
    float fiberDir = twill > 0.5 ? f.x : f.y;
    float fiber = sin(fiberDir * 12.566) * 0.5 + 0.5;
    fiber = pow(fiber, 0.5);
    float weaveDepth = twill * 0.15;
    float3 darkFiber = float3(0.02, 0.02, 0.03);
    float3 lightFiber = float3(0.08, 0.08, 0.1);
    float3 col = mix(darkFiber, lightFiber, fiber);
    col += weaveDepth * 0.05;
    float2 lightPos = float2(0.5 + 0.3*sin(t*0.5), 0.5 + 0.3*cos(t*0.3));
    float lightDist = length(uv - lightPos);
    float specular = exp(-lightDist*lightDist*8.0);
    float microSpec = pow(fiber, 8.0) * specular;
    col += float3(0.3, 0.3, 0.35) * specular * 0.4;
    col += float3(0.5, 0.5, 0.6) * microSpec * 0.3;
    float resin = 0.02 + specular*0.08;
    col += float3(resin);
    float crossGap = smoothstep(0.0, 0.05, f.x)*smoothstep(0.0, 0.05, f.y)*
                     smoothstep(1.0, 0.95, f.x)*smoothstep(1.0, 0.95, f.y);
    col *= 0.85 + crossGap*0.15;
    return float4(col, 1.0);
}
