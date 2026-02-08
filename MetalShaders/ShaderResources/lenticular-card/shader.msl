#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 lenticularCardRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + float3(0.0, 0.33, 0.67)));
}

float lenticularCardHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 lenticularCardFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.6) * 0.5;
    float tiltY = cos(iTime * 0.4) * 0.3;

    float lensCount = 60.0;
    float lensPhase = floor(uv.x * lensCount);
    float lensLocal = fract(uv.x * lensCount) - 0.5;

    float viewShift = tiltX * 3.0;
    float lensAngle = lensLocal + viewShift;

    float3 rainbow = lenticularCardRainbow(lensAngle * 0.5 + uv.y * 0.3 + iTime * 0.15);

    float ripple = sin(uv.y * 40.0 + iTime * 2.0 + tiltY * 10.0) * 0.5 + 0.5;
    ripple *= sin(uv.x * 30.0 - iTime * 1.5 + tiltX * 8.0) * 0.5 + 0.5;

    float securityPattern = sin(uv.x * 200.0) * sin(uv.y * 200.0);
    securityPattern = smoothstep(0.0, 0.1, securityPattern);

    float shimmer = sin(lensPhase * 0.5 + iTime * 3.0 + tiltX * 20.0);
    shimmer = pow(max(shimmer, 0.0), 4.0);

    float microLines = sin(uv.y * lensCount * M_PI_F) * 0.5 + 0.5;
    microLines = pow(microLines, 0.3);

    float3 baseColor = float3(0.92, 0.92, 0.95);
    float3 col = mix(baseColor, rainbow, 0.6 * ripple);
    col += shimmer * rainbow * 0.4;
    col *= 0.8 + 0.2 * microLines;
    col += securityPattern * 0.03 * rainbow;

    float fresnel = pow(1.0 - abs(dot(normalize(float3(centered, 0.5)), float3(0.0, 0.0, 1.0))), 3.0);
    col += fresnel * rainbow * 0.2;

    float border = smoothstep(0.0, 0.015, uv.x) * smoothstep(0.0, 0.015, uv.y) *
                   smoothstep(0.0, 0.015, 1.0 - uv.x) * smoothstep(0.0, 0.015, 1.0 - uv.y);
    col *= border;
    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
