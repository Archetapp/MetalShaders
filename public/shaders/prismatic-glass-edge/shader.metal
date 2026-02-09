#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 prismaticGlassEdgeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.6) * 0.4;
    float tiltY = cos(iTime * 0.8) * 0.3;
    float3 viewDir = normalize(float3(tiltX, tiltY, 1.0));

    float cardW = 0.7;
    float cardH = 0.9;
    float2 cardDist = abs(centered) - float2(cardW, cardH);
    float cardSdf = max(cardDist.x, cardDist.y);

    float bevelWidth = 0.08;
    float bevel = smoothstep(0.0, -bevelWidth, cardSdf);
    float innerCard = smoothstep(-bevelWidth, -bevelWidth - 0.01, cardSdf);
    float bevelOnly = bevel - innerCard;

    float2 edgeDir = normalize(max(cardDist, 0.0) + 0.001);
    float3 bevelNormal = normalize(float3(edgeDir * bevelOnly, 1.0 - bevelOnly * 0.5));

    float chromaticStr = bevelOnly * 0.03;
    float2 refractR = centered + viewDir.xy * chromaticStr * 1.0;
    float2 refractG = centered + viewDir.xy * chromaticStr * 0.5;
    float2 refractB = centered + viewDir.xy * chromaticStr * 0.0;

    float patternR = sin(refractR.x * 30.0 + iTime) * sin(refractR.y * 20.0) * 0.5 + 0.5;
    float patternG = sin(refractG.x * 30.0 + iTime) * sin(refractG.y * 20.0) * 0.5 + 0.5;
    float patternB = sin(refractB.x * 30.0 + iTime) * sin(refractB.y * 20.0) * 0.5 + 0.5;

    float3 glassBase = float3(0.92, 0.94, 0.96);
    float3 contentColor = float3(patternR, patternG, patternB);

    float3 lightDir = normalize(float3(tiltX * 2.0, tiltY * 2.0, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, bevelNormal), viewDir), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(bevelNormal, viewDir), 0.0), 4.0);

    float dispersion = dot(bevelNormal.xy, viewDir.xy) * 3.0;
    float3 rainbow = 0.5 + 0.5 * cos(6.28318 * (dispersion + float3(0.0, 0.33, 0.67)));

    float3 col = mix(contentColor * 0.3, glassBase, 0.5) * innerCard;
    col += rainbow * bevelOnly * 0.6;
    col += spec * float3(1.0) * 0.8;
    col += fresnel * float3(0.8, 0.85, 1.0) * 0.3;
    col *= bevel;

    float edgeHighlight = smoothstep(0.01, -0.01, cardSdf) - smoothstep(-0.005, -0.015, cardSdf);
    col += edgeHighlight * float3(1.0) * 0.3;

    float shadow = smoothstep(0.02, 0.06, cardSdf);
    float3 bg = float3(0.1, 0.1, 0.12);
    col = mix(col, bg * (1.0 - shadow * 0.3), 1.0 - bevel);

    col = pow(col, float3(0.95));
    return float4(col, 1.0);
}
