#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float stereoHashMtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float stereoDepthMapMtl(float2 p, float time) {
    float a = atan2(p.y, p.x);
    float r = length(p);
    float starShape = 0.12 + 0.05 * cos(a * 5.0 + time);
    return smoothstep(starShape + 0.01, starShape - 0.01, r) * 0.3;
}

fragment float4 stereogramDotsFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.position.xy / iResolution;
    float2 centered = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float patternWidth = 0.12;
    float depth = stereoDepthMapMtl(centered, iTime);
    float shift = depth * patternWidth;

    float repeatedX = fmod(uv.x + shift, patternWidth);
    float2 cell = float2(repeatedX, uv.y);

    float pixelSize = 3.0 / iResolution.y;
    float2 quantized = floor(cell / pixelSize) * pixelSize;

    float r = stereoHashMtl(quantized);
    float g = stereoHashMtl(quantized + 17.31);
    float b = stereoHashMtl(quantized + 31.17);

    float3 col = float3(r, g, b);
    col = mix(col, col * col, 0.3);

    float scan = sin(in.position.y * 2.0) * 0.02;
    col += scan;

    return float4(col, 1.0);
}
