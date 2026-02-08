#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float touchShockHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 touchShockwaveFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float2 distortedUv = uv;
    float3 waveColor = float3(0.0);

    for (int i = 0; i < 4; i++) {
        float cycleTime = 2.5;
        float t = iTime * 0.8 + float(i) * cycleTime * 0.25;
        float phase = fmod(t, cycleTime);
        float age = phase / cycleTime;

        float2 origin = float2(
            sin(floor(t / cycleTime) * 2.1 + float(i)) * 0.25,
            cos(floor(t / cycleTime) * 1.7 + float(i) * 0.7) * 0.25
        );

        float dist = length(uv - origin);
        float waveRadius = age * 0.8;
        float waveWidth = 0.03 + age * 0.02;
        float waveFalloff = max(0.0, 1.0 - age);

        float wave = exp(-pow(dist - waveRadius, 2.0) / (waveWidth * waveWidth));
        wave *= waveFalloff;

        float2 dir = normalize(uv - origin + 0.001);
        distortedUv += dir * wave * 0.05 * waveFalloff;

        float innerRing = exp(-pow(dist - waveRadius * 0.8, 2.0) / (waveWidth * 0.5 * waveWidth * 0.5));
        float outerRing = exp(-pow(dist - waveRadius * 1.1, 2.0) / (waveWidth * 0.3 * waveWidth * 0.3));

        float3 ringColor = mix(float3(0.2, 0.5, 1.0), float3(0.0, 1.0, 0.8), age);
        waveColor += wave * ringColor * 0.8;
        waveColor += innerRing * waveFalloff * float3(0.5, 0.7, 1.0) * 0.4;
        waveColor += outerRing * waveFalloff * float3(0.1, 0.3, 0.6) * 0.3;

        float flash = exp(-age * 8.0) * exp(-dist * 10.0);
        waveColor += flash * float3(0.8, 0.9, 1.0) * 2.0;
    }

    float distGrid = smoothstep(0.01, 0.0, abs(fract(distortedUv.x * 8.0) - 0.5) - 0.48) +
                     smoothstep(0.01, 0.0, abs(fract(distortedUv.y * 8.0) - 0.5) - 0.48);
    float3 distBg = float3(0.05, 0.08, 0.12) + distGrid * float3(0.02, 0.04, 0.06);

    float3 col = distBg + waveColor;
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
