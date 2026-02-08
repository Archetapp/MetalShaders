#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float brushedAlumHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float brushedAlumNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(brushedAlumHash(i), brushedAlumHash(i + float2(1, 0)), f.x),
               mix(brushedAlumHash(i + float2(0, 1)), brushedAlumHash(i + float2(1, 1)), f.x), f.y);
}

fragment float4 brushedAluminumTiltFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.5;
    float tiltY = cos(iTime * 0.7) * 0.3;
    float3 viewDir = normalize(float3(tiltX, tiltY, 1.0));

    float brushNoise = brushedAlumNoise(float2(uv.x * 2.0, uv.y * 400.0)) * 0.5 +
                       brushedAlumNoise(float2(uv.x * 4.0, uv.y * 800.0)) * 0.3 +
                       brushedAlumNoise(float2(uv.x * 8.0, uv.y * 1600.0)) * 0.2;

    float3 tangent = normalize(float3(1.0, 0.0, 0.0));
    float3 normal = normalize(float3(
        (brushNoise - 0.5) * 0.15,
        0.0,
        1.0
    ));

    float3 lightDir = normalize(float3(sin(iTime * 0.3) * 0.5, 0.8, 1.0));

    float3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVec), 0.0);
    float TdotH = dot(tangent, halfVec);

    float anisoSpec = exp(-TdotH * TdotH * 2.0) * pow(NdotH, 8.0);
    float broadSpec = pow(NdotH, 16.0);
    float tightSpec = pow(NdotH, 128.0);

    float diff = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);

    float microGroove = sin(uv.y * 500.0 + brushNoise * 10.0) * 0.5 + 0.5;
    microGroove = pow(microGroove, 0.5);

    float3 aluminumBase = float3(0.78, 0.78, 0.80);
    float3 aluminumHighlight = float3(0.95, 0.95, 0.97);

    float3 col = aluminumBase * (0.3 + diff * 0.5);
    col += anisoSpec * aluminumHighlight * 0.6;
    col += broadSpec * aluminumHighlight * 0.2;
    col += tightSpec * float3(1.0) * 0.4;
    col += fresnel * float3(0.9, 0.9, 0.92) * 0.15;
    col *= 0.85 + 0.15 * microGroove;
    col *= 0.9 + 0.1 * brushNoise;

    float vignette = 1.0 - 0.2 * length(centered * 0.4);
    col *= vignette;
    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
