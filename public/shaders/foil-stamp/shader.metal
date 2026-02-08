#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float foilStampHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float foilStampNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = foilStampHash(i);
    float b = foilStampHash(i + float2(1.0, 0.0));
    float c = foilStampHash(i + float2(0.0, 1.0));
    float d = foilStampHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float3 foilStampIridescence(float angle, float thickness) {
    float phase = thickness * cos(angle) * 12.0;
    return 0.5 + 0.5 * cos(float3(0.0, 2.094, 4.189) + phase);
}

fragment float4 foilStampFragment(
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

    float thickness = 0.5 + 0.3 * foilStampNoise(uv * 3.0 + iTime * 0.05);
    float viewAngle = dot(normalize(float3(centered, 0.0)), viewDir);

    float3 iridColor = foilStampIridescence(viewAngle, thickness);

    float stampPattern = smoothstep(0.4, 0.38, abs(centered.x)) *
                         smoothstep(0.6, 0.58, abs(centered.y));
    float borderStamp = smoothstep(0.35, 0.34, abs(centered.x)) *
                        smoothstep(0.55, 0.54, abs(centered.y));
    borderStamp = max(stampPattern - borderStamp, 0.0);
    float emboss = stampPattern + borderStamp * 0.5;

    float2 eps = float2(0.001, 0.0);
    float embossR = smoothstep(0.4, 0.38, abs((centered + eps).x)) *
                    smoothstep(0.6, 0.58, abs(centered.y));
    float embossU = smoothstep(0.4, 0.38, abs(centered.x)) *
                    smoothstep(0.6, 0.58, abs((centered + eps.yx).y));
    float3 normal = normalize(float3(
        (embossR - emboss) * 20.0,
        (embossU - emboss) * 20.0,
        1.0
    ));

    float3 lightDir = normalize(float3(tiltX * 2.0, tiltY * 2.0, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 64.0);
    float diff = max(dot(normal, lightDir), 0.0);

    float flakeScale = 80.0;
    float2 flakeUv = floor(uv * flakeScale);
    float flakeAngle = foilStampHash(flakeUv) * 6.2832;
    float3 flakeNormal = normalize(float3(cos(flakeAngle) * 0.3, sin(flakeAngle) * 0.3, 1.0));
    float flakeSpec = pow(max(dot(reflect(-lightDir, flakeNormal), viewDir), 0.0), 128.0);
    float flakeIntensity = flakeSpec * (0.5 + 0.5 * foilStampHash(flakeUv + 42.0));

    float3 metalBase = float3(0.85, 0.82, 0.75);
    float3 col = metalBase * (0.3 + diff * 0.7);
    col = mix(col, iridColor, 0.4 * emboss);
    col += spec * float3(1.0, 0.95, 0.9) * 0.8;
    col += flakeIntensity * float3(1.0, 0.98, 0.95) * emboss;

    float vignette = 1.0 - 0.3 * length(centered * 0.5);
    col *= vignette;
    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
