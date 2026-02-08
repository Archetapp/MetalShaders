#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float termHashMtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float termCharMtl(float2 p, float seed) {
    float2 grid = floor(p * float2(4.0, 6.0));
    float filled = step(0.4, termHashMtl(grid + seed * 100.0));
    return filled * step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);
}

fragment float4 retroTerminalFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.position.xy / iResolution;
    float2 cuv = uv * 2.0 - 1.0;
    cuv *= 1.0 + 0.03 * length(cuv * cuv);
    uv = cuv * 0.5 + 0.5;

    float3 col = float3(0.0, 0.02, 0.0);

    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
        float charW = 10.0;
        float charH = 16.0;
        float cols = floor(iResolution.x / charW);
        float rows = floor(iResolution.y / charH);

        float2 charPos = floor(uv * float2(cols, rows));
        float2 charUV = fract(uv * float2(cols, rows));

        float lineIdx = rows - 1.0 - charPos.y;
        float typing = iTime * 15.0;
        float charIdx = charPos.x + lineIdx * cols;

        float visible = step(charIdx, typing);
        float seed = termHashMtl(charPos + floor(charIdx / cols));
        float ch = termCharMtl(charUV, seed) * visible;

        float cursorX = fmod(typing, cols);
        float cursorY = rows - 1.0 - floor(typing / cols);
        float cursor = step(abs(charPos.x - cursorX), 0.5) * step(abs(charPos.y - cursorY), 0.5);
        float cursorBlink = step(0.5, fract(iTime * 2.0));
        ch = max(ch, cursor * cursorBlink);

        col += float3(0.0, 0.8, 0.0) * ch;
        col += float3(0.0, 0.15, 0.0) * visible * 0.1;
    }

    float scanline = sin(in.position.y * 1.5) * 0.08;
    col -= scanline;

    float flicker = 0.97 + 0.03 * sin(iTime * 8.0);
    col *= flicker;

    col += float3(0.0, 0.05, 0.0) * exp(-length(cuv) * 1.5);
    col *= 1.0 - 0.5 * length(cuv);

    return float4(col, 1.0);
}
