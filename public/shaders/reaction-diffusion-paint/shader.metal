#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float rdPaintHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float rdPaintNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(rdPaintHash(i), rdPaintHash(i + float2(1, 0)), f.x),
               mix(rdPaintHash(i + float2(0, 1)), rdPaintHash(i + float2(1, 1)), f.x), f.y);
}

fragment float4 reactionDiffusionPaintFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float pattern = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float2 seedPoint = float2(sin(fi * 2.1 + 1.0) * 0.3, cos(fi * 1.7 + 0.5) * 0.25);
        float seedTime = fi * 1.2;
        float growthTime = max(0.0, iTime - seedTime);
        float growthRadius = growthTime * 0.08;

        float dist = length(uv - seedPoint);
        if (dist < growthRadius + 0.2) {
            float growMask = smoothstep(growthRadius + 0.1, growthRadius - 0.05, dist);
            float scale = 15.0 + fi * 3.0;
            float n1 = rdPaintNoise(uv * scale + iTime * 0.1 + fi * 10.0);
            float n2 = rdPaintNoise(uv * scale * 2.0 - iTime * 0.15 + fi * 20.0);
            float n3 = rdPaintNoise(uv * scale * 0.5 + float2(iTime * 0.05));

            float rdPattern = sin(n1 * 10.0 + n2 * 5.0 + dist * 20.0) * 0.5 + 0.5;
            rdPattern *= sin(n2 * 8.0 - n3 * 6.0 + atan2(uv.y - seedPoint.y, uv.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
            rdPattern = smoothstep(0.3, 0.7, rdPattern);

            pattern += rdPattern * growMask;
        }
    }
    pattern = clamp(pattern, 0.0, 1.0);

    float3 bg = float3(0.95, 0.93, 0.88);
    float3 patternColor1 = float3(0.1, 0.3, 0.5);
    float3 patternColor2 = float3(0.5, 0.15, 0.2);
    float colorMix = rdPaintNoise(uv * 3.0 + iTime * 0.02);
    float3 patternColor = mix(patternColor1, patternColor2, colorMix);

    float3 col = mix(bg, patternColor, pattern);
    float2 epsFD = float2(1.0 / iResolution.x, 1.0 / iResolution.y);
    float2 uvR = uv + float2(epsFD.x, 0.0);
    float2 uvL = uv - float2(epsFD.x, 0.0);
    float2 uvU = uv + float2(0.0, epsFD.y);
    float2 uvD = uv - float2(0.0, epsFD.y);
    float patternR = 0.0, patternL = 0.0, patternU = 0.0, patternD = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float2 seedPoint = float2(sin(fi * 2.1 + 1.0) * 0.3, cos(fi * 1.7 + 0.5) * 0.25);
        float seedTime = fi * 1.2;
        float growthTime = max(0.0, iTime - seedTime);
        float growthRadius = growthTime * 0.08;
        float scale = 15.0 + fi * 3.0;
        float n1R = rdPaintNoise(uvR * scale + iTime * 0.1 + fi * 10.0);
        float n2R = rdPaintNoise(uvR * scale * 2.0 - iTime * 0.15 + fi * 20.0);
        float n3R = rdPaintNoise(uvR * scale * 0.5 + float2(iTime * 0.05));
        float distR = length(uvR - seedPoint);
        float growMaskR = smoothstep(growthRadius + 0.1, growthRadius - 0.05, distR);
        float rdR = sin(n1R * 10.0 + n2R * 5.0 + distR * 20.0) * 0.5 + 0.5;
        rdR *= sin(n2R * 8.0 - n3R * 6.0 + atan2(uvR.y - seedPoint.y, uvR.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
        patternR += smoothstep(0.3, 0.7, rdR) * growMaskR;

        float n1L = rdPaintNoise(uvL * scale + iTime * 0.1 + fi * 10.0);
        float n2L = rdPaintNoise(uvL * scale * 2.0 - iTime * 0.15 + fi * 20.0);
        float n3L = rdPaintNoise(uvL * scale * 0.5 + float2(iTime * 0.05));
        float distL = length(uvL - seedPoint);
        float growMaskL = smoothstep(growthRadius + 0.1, growthRadius - 0.05, distL);
        float rdL = sin(n1L * 10.0 + n2L * 5.0 + distL * 20.0) * 0.5 + 0.5;
        rdL *= sin(n2L * 8.0 - n3L * 6.0 + atan2(uvL.y - seedPoint.y, uvL.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
        patternL += smoothstep(0.3, 0.7, rdL) * growMaskL;

        float n1U = rdPaintNoise(uvU * scale + iTime * 0.1 + fi * 10.0);
        float n2U = rdPaintNoise(uvU * scale * 2.0 - iTime * 0.15 + fi * 20.0);
        float n3U = rdPaintNoise(uvU * scale * 0.5 + float2(iTime * 0.05));
        float distU = length(uvU - seedPoint);
        float growMaskU = smoothstep(growthRadius + 0.1, growthRadius - 0.05, distU);
        float rdU = sin(n1U * 10.0 + n2U * 5.0 + distU * 20.0) * 0.5 + 0.5;
        rdU *= sin(n2U * 8.0 - n3U * 6.0 + atan2(uvU.y - seedPoint.y, uvU.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
        patternU += smoothstep(0.3, 0.7, rdU) * growMaskU;

        float n1D = rdPaintNoise(uvD * scale + iTime * 0.1 + fi * 10.0);
        float n2D = rdPaintNoise(uvD * scale * 2.0 - iTime * 0.15 + fi * 20.0);
        float n3D = rdPaintNoise(uvD * scale * 0.5 + float2(iTime * 0.05));
        float distD = length(uvD - seedPoint);
        float growMaskD = smoothstep(growthRadius + 0.1, growthRadius - 0.05, distD);
        float rdD = sin(n1D * 10.0 + n2D * 5.0 + distD * 20.0) * 0.5 + 0.5;
        rdD *= sin(n2D * 8.0 - n3D * 6.0 + atan2(uvD.y - seedPoint.y, uvD.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
        patternD += smoothstep(0.3, 0.7, rdD) * growMaskD;
    }
    float edge = abs(clamp(patternR, 0.0, 1.0) - clamp(patternL, 0.0, 1.0)) + abs(clamp(patternU, 0.0, 1.0) - clamp(patternD, 0.0, 1.0));
    col += edge * 0.3;
    return float4(col, 1.0);
}
