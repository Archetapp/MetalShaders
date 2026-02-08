#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 prismSpectrum(float t) {
    float3 col = float3(0.0);
    col += float3(1.0, 0.0, 0.0) * smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.15, 0.3, t));
    col += float3(1.0, 0.5, 0.0) * smoothstep(0.1, 0.25, t) * (1.0 - smoothstep(0.25, 0.4, t));
    col += float3(1.0, 1.0, 0.0) * smoothstep(0.2, 0.35, t) * (1.0 - smoothstep(0.35, 0.5, t));
    col += float3(0.0, 1.0, 0.0) * smoothstep(0.35, 0.45, t) * (1.0 - smoothstep(0.45, 0.6, t));
    col += float3(0.0, 0.5, 1.0) * smoothstep(0.5, 0.6, t) * (1.0 - smoothstep(0.6, 0.75, t));
    col += float3(0.3, 0.0, 1.0) * smoothstep(0.65, 0.75, t) * (1.0 - smoothstep(0.75, 0.9, t));
    col += float3(0.5, 0.0, 0.8) * smoothstep(0.8, 0.9, t) * (1.0 - smoothstep(0.9, 1.0, t));
    return col;
}

fragment float4 prismaticLightFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float2 centered = uv - 0.5;
    
    float prismX = 0.35 + sin(iTime * 0.3) * 0.05;
    
    float beam = smoothstep(0.008, 0.0, abs(centered.y)) * step(uv.x, prismX);
    beam *= smoothstep(0.0, 0.1, uv.x);
    
    float spread = (uv.x - prismX) * 1.2;
    float specY = centered.y / max(spread, 0.001);
    float specT = specY * 0.5 + 0.5;
    
    float rainbow = step(prismX, uv.x) * smoothstep(0.0, 0.05, spread);
    float bandWidth = 0.5 + spread * 2.0;
    rainbow *= smoothstep(bandWidth, bandWidth * 0.8, abs(specY));
    
    float3 col = float3(0.02);
    col += float3(0.95, 0.95, 1.0) * beam * 2.0;
    col += prismSpectrum(clamp(specT, 0.0, 1.0)) * rainbow * 1.5;
    
    float prismEdge = smoothstep(0.04, 0.035, abs(centered.x - (prismX - 0.5))) * step(abs(centered.y), 0.12);
    col += float3(0.15, 0.15, 0.2) * prismEdge * 0.5;
    
    return float4(col, 1.0);
}
