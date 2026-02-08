#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float heatMapHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float heatMapNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(heatMapHash(i), heatMapHash(i + float2(1, 0)), f.x),
               mix(heatMapHash(i + float2(0, 1)), heatMapHash(i + float2(1, 1)), f.x), f.y);
}

float3 heatMapThermalPalette(float t) {
    if (t < 0.25) return mix(float3(0.0, 0.0, 0.2), float3(0.0, 0.0, 1.0), t * 4.0);
    if (t < 0.5) return mix(float3(0.0, 0.0, 1.0), float3(0.0, 1.0, 0.0), (t - 0.25) * 4.0);
    if (t < 0.75) return mix(float3(0.0, 1.0, 0.0), float3(1.0, 1.0, 0.0), (t - 0.5) * 4.0);
    return mix(float3(1.0, 1.0, 0.0), float3(1.0, 0.0, 0.0), (t - 0.75) * 4.0);
}

fragment float4 heatMapTouchFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float heat = 0.0;

    for (int i = 0; i < 6; i++) {
        float t = iTime * 0.4 + float(i) * 1.5;
        float phase = floor(t / 3.0);
        float localT = fract(t / 3.0) * 3.0;

        float2 touchPos = float2(
            sin(phase * 2.1 + float(i)) * 0.3,
            cos(phase * 1.7 + float(i) * 0.5) * 0.3
        );

        float age = localT;
        float radius = 0.05 + age * 0.08;
        float intensity = max(0.0, 1.0 - age * 0.35);

        float dist = length(uv - touchPos);
        float heatContrib = exp(-dist * dist / (radius * radius)) * intensity;

        heat += heatContrib;
    }

    float noiseVal = heatMapNoise(uv * 8.0 + iTime * 0.1) * 0.1;
    heat += noiseVal * 0.3;

    float ambientHeat = 0.15 + 0.05 * sin(uv.x * 3.0 + iTime * 0.2) +
                        0.05 * sin(uv.y * 2.5 - iTime * 0.15);
    heat += ambientHeat;

    heat = clamp(heat, 0.0, 1.0);

    float3 col = heatMapThermalPalette(heat);

    float scanline = sin(in.uv.y * iResolution.y * 2.0) * 0.03;
    col += scanline;

    float noiseGrain = (heatMapHash(uv * 500.0 + iTime) - 0.5) * 0.04;
    col += noiseGrain;

    float vignette = 1.0 - 0.3 * length(uv);
    col *= vignette;

    return float4(col, 1.0);
}
