#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 crtBarrelDistortion(float2 uv, float amount) {
    float2 cc = uv - 0.5;
    float dist = dot(cc, cc);
    return uv + cc * dist * amount;
}

float3 crtContent(float2 uv, float t) {
    float3 col = float3(0.0);

    float bars = sin(uv.x * 6.28 * 4.0) * 0.5 + 0.5;
    float3 barColor = 0.5 + 0.5 * cos(float3(0.0, 2.0, 4.0) + uv.x * 6.0 + t);
    col += barColor * bars * 0.3;

    float wave = sin(uv.y * 20.0 + t * 3.0 + sin(uv.x * 10.0 + t) * 2.0) * 0.5 + 0.5;
    col += float3(0.2, 0.8, 0.4) * wave * 0.3;

    float circle = smoothstep(0.22, 0.2, length(uv - float2(0.5 + sin(t) * 0.2, 0.5 + cos(t * 0.7) * 0.15)));
    col += float3(0.9, 0.3, 0.1) * circle;

    float text = step(0.5, fract(uv.x * 40.0)) * step(0.5, fract(uv.y * 25.0));
    float textMask = smoothstep(0.1, 0.15, uv.y) * smoothstep(0.9, 0.85, uv.y);
    col += float3(0.1, 0.9, 0.2) * text * textMask * 0.1;

    return clamp(col, 0.0, 1.0);
}

fragment float4 crtMonitorFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = fragCoord / iResolution;
    float t = iTime;

    float2 crtUV = crtBarrelDistortion(uv, 0.15);

    float border = step(0.0, crtUV.x) * step(crtUV.x, 1.0) * step(0.0, crtUV.y) * step(crtUV.y, 1.0);

    float3 col = crtContent(crtUV, t);

    float bleed = 0.003;
    float3 bleedCol;
    bleedCol.r = crtContent(crtUV + float2(bleed, 0.0), t).r;
    bleedCol.g = col.g;
    bleedCol.b = crtContent(crtUV - float2(bleed, 0.0), t).b;
    col = mix(col, bleedCol, 0.7);

    float pixelY = fragCoord.y;
    float scanline = 0.85 + 0.15 * sin(pixelY * M_PI_F * 2.0);
    col *= scanline;

    float scanBright = 0.95 + 0.05 * sin(pixelY * 0.5 - t * 10.0);
    col *= scanBright;

    float2 pixelCoord = crtUV * iResolution;
    float subpixel = fmod(pixelCoord.x, 3.0);
    float3 phosphor;
    if (subpixel < 1.0) {
        phosphor = float3(1.0, 0.3, 0.3);
    } else if (subpixel < 2.0) {
        phosphor = float3(0.3, 1.0, 0.3);
    } else {
        phosphor = float3(0.3, 0.3, 1.0);
    }
    col *= mix(float3(1.0), phosphor, 0.3);

    float vig = 16.0 * crtUV.x * crtUV.y * (1.0 - crtUV.x) * (1.0 - crtUV.y);
    col *= pow(vig, 0.2);

    col *= 1.1;

    float flicker = 0.98 + 0.02 * sin(t * 60.0);
    col *= flicker;

    float grain = fract(sin(dot(fragCoord + t, float2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.03;

    col *= border;

    float2 edgeDist = abs(crtUV - 0.5) * 2.0;
    float edgeGlow = smoothstep(0.95, 1.05, max(edgeDist.x, edgeDist.y));
    col += float3(0.05, 0.05, 0.08) * edgeGlow;

    float bezel = smoothstep(1.0, 1.05, max(edgeDist.x * 1.02, edgeDist.y * 1.02));
    col = mix(col, float3(0.02), bezel);

    return float4(col, 1.0);
}
