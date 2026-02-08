#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float parallaxDepthHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float parallaxDepthNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(parallaxDepthHash(i), parallaxDepthHash(i + float2(1, 0)), f.x),
               mix(parallaxDepthHash(i + float2(0, 1)), parallaxDepthHash(i + float2(1, 1)), f.x), f.y);
}

fragment float4 parallaxDepthCardFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.3;
    float tiltY = cos(iTime * 0.7) * 0.2;

    float3 bgColor = float3(0.08, 0.06, 0.15);
    float bgStars = parallaxDepthHash(floor(uv * 100.0));
    bgStars = pow(bgStars, 20.0) * 2.0;
    float3 col = bgColor + bgStars;

    float2 layer1Uv = centered + float2(tiltX, tiltY) * 0.05;
    float nebula = parallaxDepthNoise(layer1Uv * 2.0 + iTime * 0.02);
    nebula += parallaxDepthNoise(layer1Uv * 4.0 - iTime * 0.03) * 0.5;
    float3 nebulaColor = mix(float3(0.1, 0.0, 0.2), float3(0.0, 0.1, 0.3), nebula);
    col += nebulaColor * 0.3;

    float2 layer2Uv = centered + float2(tiltX, tiltY) * 0.15;
    float ring1 = abs(length(layer2Uv - float2(0.2, 0.1)) - 0.3);
    ring1 = smoothstep(0.02, 0.0, ring1);
    float ring2 = abs(length(layer2Uv + float2(0.1, 0.2)) - 0.2);
    ring2 = smoothstep(0.015, 0.0, ring2);
    col += ring1 * float3(0.3, 0.5, 1.0) * 0.6;
    col += ring2 * float3(1.0, 0.3, 0.5) * 0.5;

    float2 layer3Uv = centered + float2(tiltX, tiltY) * 0.3;
    float shape1 = smoothstep(0.12, 0.1, length(layer3Uv - float2(-0.3, 0.2)));
    float shape2 = smoothstep(0.08, 0.06, length(layer3Uv - float2(0.25, -0.15)));
    float shape3 = smoothstep(0.15, 0.13, length(layer3Uv));
    col = mix(col, float3(0.2, 0.6, 1.0), shape1 * 0.8);
    col = mix(col, float3(1.0, 0.4, 0.2), shape2 * 0.8);
    col = mix(col, float3(0.9, 0.8, 0.3), shape3 * 0.6);

    float2 layer4Uv = centered + float2(tiltX, tiltY) * 0.5;
    for (int i = 0; i < 5; i++) {
        float2 particlePos = float2(
            sin(float(i) * 2.4 + iTime * 0.3) * 0.4,
            cos(float(i) * 1.7 + iTime * 0.2) * 0.3
        );
        float particle = smoothstep(0.04, 0.02, length(layer4Uv - particlePos));
        float3 particleColor = 0.5 + 0.5 * cos(6.28 * (float(i) * 0.2 + float3(0.0, 0.33, 0.67)));
        col += particle * particleColor * 0.7;
    }

    float2 layer5Uv = centered + float2(tiltX, tiltY) * 0.7;
    float grid = smoothstep(0.01, 0.0, abs(fract(layer5Uv.x * 5.0) - 0.5) - 0.48) +
                 smoothstep(0.01, 0.0, abs(fract(layer5Uv.y * 5.0) - 0.5) - 0.48);
    col += grid * float3(0.15, 0.2, 0.3) * 0.3;

    float shadow = smoothstep(0.0, 0.1, length(float2(tiltX, tiltY))) * 0.2;
    col *= 1.0 - shadow * (0.5 + 0.5 * dot(normalize(centered + 0.001), normalize(float2(tiltX, tiltY) + 0.001)));

    float aspect = iResolution.x / iResolution.y;
    float cardMask = smoothstep(0.0, 0.02, 0.85 - max(abs(centered.x / aspect), abs(centered.y)));
    col *= cardMask;
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
