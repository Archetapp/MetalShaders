#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float blobField(float2 uv, float t) {
    float field = 0.0;
    float2 p1 = float2(sin(t * 0.7) * 0.3, cos(t * 0.5) * 0.3);
    float2 p2 = float2(cos(t * 0.6) * 0.25, sin(t * 0.8) * 0.25);
    float2 p3 = float2(sin(t * 0.4 + 2.0) * 0.35, cos(t * 0.3 + 1.0) * 0.2);
    float2 p4 = float2(cos(t * 0.9 + 3.0) * 0.2, sin(t * 0.6 + 2.0) * 0.35);
    float2 p5 = float2(sin(t * 0.5 + 4.0) * 0.15, cos(t * 0.7 + 3.0) * 0.3);
    
    field += 0.08 / (length(uv - p1) + 0.01);
    field += 0.06 / (length(uv - p2) + 0.01);
    field += 0.07 / (length(uv - p3) + 0.01);
    field += 0.05 / (length(uv - p4) + 0.01);
    field += 0.06 / (length(uv - p5) + 0.01);
    return field;
}

fragment float4 morphingBlobsFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.8;
    float field = blobField(uv, t);
    
    float3 c1 = float3(0.95, 0.3, 0.5);
    float3 c2 = float3(0.3, 0.5, 0.95);
    float3 c3 = float3(0.4, 0.9, 0.6);
    
    float f = smoothstep(0.8, 2.5, field);
    float3 col = mix(c1, c2, sin(field * 0.5 + t) * 0.5 + 0.5);
    col = mix(col, c3, cos(field * 0.3 + t * 0.7) * 0.5 + 0.5);
    col *= f;
    col += (1.0 - f) * float3(0.02, 0.02, 0.05);
    
    return float4(col, 1.0);
}
