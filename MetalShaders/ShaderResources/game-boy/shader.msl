#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 gbPaletteMtl(float v) {
    if (v < 0.25) return float3(0.06, 0.22, 0.06);
    if (v < 0.5) return float3(0.19, 0.38, 0.19);
    if (v < 0.75) return float3(0.55, 0.67, 0.06);
    return float3(0.61, 0.73, 0.06);
}

fragment float4 gameBoyFragment(VertexOut in [[stage_in]],
                                 constant float &iTime [[buffer(0)]],
                                 constant float2 &iResolution [[buffer(1)]]) {
    float pixelSize = 4.0;
    float2 pixUV = floor(in.position.xy / pixelSize);
    float2 uv = (pixUV * pixelSize - 0.5 * iResolution) / iResolution.y;

    float scene = 0.0;

    float ground = step(uv.y, -0.1 + 0.02 * sin(uv.x * 5.0 + iTime));
    scene += ground * 0.3;

    float hillY = -0.1 + 0.08 * sin(uv.x * 2.0 + 0.5) + 0.05 * sin(uv.x * 4.0 + 1.0);
    float hills = step(uv.y, hillY) * (1.0 - ground);
    scene += hills * 0.5;

    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float treeX = -0.3 + fi * 0.3 + sin(iTime * 0.5 + fi) * 0.02;
        float trunk = step(abs(uv.x - treeX), 0.015) * step(-0.1, uv.y) * step(uv.y, 0.05);
        float canopy = step(length(uv - float2(treeX, 0.08)), 0.06);
        scene += (trunk + canopy) * 0.6;
    }

    float sunY = 0.25 + 0.05 * sin(iTime * 0.3);
    float sun = step(length(uv - float2(0.25, sunY)), 0.05);
    scene += sun * 0.9;

    float clouds = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float cx = fmod(fi * 0.4 + iTime * 0.05, 1.4) - 0.7;
        float cy = 0.2 + fi * 0.05;
        clouds += step(length((uv - float2(cx, cy)) * float2(1.0, 2.0)), 0.04);
    }
    scene += clouds * 0.75;

    float character = step(length(uv - float2(0.0, -0.05)), 0.025);
    scene += character * 0.4;

    scene = clamp(scene, 0.0, 1.0);
    float3 col = gbPaletteMtl(scene);

    float gridLine = step(0.9, fract(pixUV.x)) + step(0.9, fract(pixUV.y));
    col *= 1.0 - gridLine * 0.05;

    return float4(col, 1.0);
}
