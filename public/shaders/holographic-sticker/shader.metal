#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float holoStickerHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float holoStickerNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(holoStickerHash(i), holoStickerHash(i + float2(1, 0)), f.x),
               mix(holoStickerHash(i + float2(0, 1)), holoStickerHash(i + float2(1, 1)), f.x), f.y);
}

float3 holoStickerRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + float3(0.0, 0.33, 0.67)));
}

fragment float4 holographicStickerFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.5;
    float tiltY = cos(iTime * 0.7) * 0.4;
    float3 viewDir = normalize(float3(tiltX, tiltY, 1.0));

    float starAngle = atan2(centered.y, centered.x);
    float starRadius = length(centered);
    float starPattern = sin(starAngle * 5.0) * 0.5 + 0.5;
    starPattern *= smoothstep(0.5, 0.2, starRadius);
    float circlePattern = smoothstep(0.32, 0.3, starRadius) - smoothstep(0.3, 0.28, starRadius);
    float emboss = starPattern + circlePattern;

    float text1 = smoothstep(0.02, 0.0, abs(centered.y + 0.55) + abs(centered.x) * 0.3 - 0.15);
    emboss += text1 * 0.5;

    float2 eps = float2(0.002, 0.0);
    float2 cp = centered;
    float eR = sin(atan2(cp.y, cp.x + eps.x) * 5.0) * 0.5 + 0.5;
    float eU = sin(atan2(cp.y + eps.x, cp.x) * 5.0) * 0.5 + 0.5;
    float3 embossNormal = normalize(float3(
        (eR - starPattern) * 15.0,
        (eU - starPattern) * 15.0,
        1.0
    ));

    float diffraction = dot(uv, viewDir.xy) * 6.0;
    diffraction += holoStickerNoise(uv * 4.0) * 1.5;
    float3 rainbow = holoStickerRainbow(diffraction + iTime * 0.2);

    float pearl = 0.5 + 0.5 * sin(dot(centered, viewDir.xy) * 15.0 + iTime);
    float3 pearlColor = mix(float3(1.0, 0.95, 0.98), float3(0.95, 0.98, 1.0), pearl);

    float3 lightDir = normalize(float3(tiltX, tiltY, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, embossNormal), viewDir), 0.0), 48.0);
    float diff = max(dot(embossNormal, lightDir), 0.0);

    float angleReveal = dot(viewDir.xy, normalize(centered + 0.001));
    float revealMask = smoothstep(0.3, 0.7, angleReveal * 0.5 + 0.5);

    float3 col = pearlColor * (0.4 + diff * 0.4);
    col = mix(col, rainbow, 0.5);
    col += spec * float3(1.0) * 0.6;
    col += emboss * revealMask * rainbow * 0.3;

    float stickerEdge = smoothstep(0.85, 0.83, max(abs(centered.x), abs(centered.y)));
    col *= stickerEdge;

    float peel = smoothstep(0.8, 0.75, centered.x + centered.y * 0.3 + 0.5);
    col *= 0.9 + 0.1 * peel;

    col = pow(col, float3(0.95));
    return float4(col, 1.0);
}
