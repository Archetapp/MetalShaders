#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bayerMatrixMtl(float2 p) {
    float2 i = fmod(p, 4.0);
    int x = int(i.x);
    int y = int(i.y);
    int idx = x + y * 4;
    constant float bayer[] = {0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0,
                              3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0};
    return bayer[clamp(idx, 0, 15)] / 16.0;
}

float3 ditherQuantizeMtl(float3 col, float levels) {
    return floor(col * levels + 0.5) / levels;
}

fragment float4 pixelDitheringFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float pixelSize = 4.0;
    float2 pixUV = floor(in.position.xy / pixelSize) * pixelSize;
    float2 pixCentered = (pixUV - 0.5 * iResolution) / iResolution.y;

    float3 scene = float3(0.0);
    float r = length(pixCentered);
    float a = atan2(pixCentered.y, pixCentered.x);
    scene.r = 0.5 + 0.5 * sin(r * 10.0 - iTime * 2.0 + a * 2.0);
    scene.g = 0.5 + 0.5 * sin(r * 8.0 - iTime * 1.5 + a * 3.0 + 2.0);
    scene.b = 0.5 + 0.5 * sin(r * 12.0 - iTime * 2.5 + a + 4.0);

    float gradient = smoothstep(0.5, 0.0, r);
    scene *= gradient;

    float dither = bayerMatrixMtl(in.position.xy / pixelSize);
    float levels = 4.0;
    float3 col = ditherQuantizeMtl(scene + (dither - 0.5) / levels, levels);

    float scanline = fmod(in.position.y / pixelSize, 2.0) < 1.0 ? 0.95 : 1.0;
    col *= scanline;

    return float4(col, 1.0);
}
