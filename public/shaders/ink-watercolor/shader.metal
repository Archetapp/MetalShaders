#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float iwHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float iwNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = iwHash(i);
    float b = iwHash(i + float2(1.0, 0.0));
    float c = iwHash(i + float2(0.0, 1.0));
    float d = iwHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float iwFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 7; i++) {
        v += a * iwNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float iwInkDrop(float2 uv, float2 center, float t, float startTime, float seed) {
    float elapsed = max(0.0, t - startTime);
    float spread = elapsed * 0.15;
    spread = spread / (1.0 + spread * 2.0);

    float2 diff = uv - center;
    float angle = atan2(diff.y, diff.x);

    float noiseOffset = iwFbm(uv * 8.0 + seed * 5.0 + elapsed * 0.3) * 0.15;
    noiseOffset += iwFbm(uv * 15.0 + seed * 10.0) * 0.08;

    float fingerNoise = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
        float a = i * 0.785 + seed * 6.28;
        float strength = iwHash(float2(seed, i)) * 0.08;
        fingerNoise += strength * exp(-pow(fmod(angle - a + 6.28, 6.28) - 3.14, 2.0) * 3.0);
    }

    float radius = spread + noiseOffset + fingerNoise;
    float dist = length(diff);

    float edge = smoothstep(radius + 0.01, radius - 0.02, dist);

    float concentration = edge * (1.0 - smoothstep(0.0, radius * 0.8, dist) * 0.6);
    concentration *= smoothstep(0.0, 0.5, elapsed);

    float edgeBleed = smoothstep(radius - 0.04, radius, dist) * edge;
    concentration += edgeBleed * 0.3;

    return concentration;
}

fragment float4 inkWatercolorFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float paperNoise = iwFbm(uv * 20.0) * 0.08;
    float paperGrain = iwNoise(uv * 100.0) * 0.03;
    float3 paperColor = float3(0.95, 0.93, 0.88) - paperNoise - paperGrain;

    float fiberX = sin(uv.x * 200.0 + iwNoise(uv * 50.0) * 5.0) * 0.005;
    float fiberY = sin(uv.y * 200.0 + iwNoise(uv * 50.0 + 7.0) * 5.0) * 0.005;
    paperColor -= (fiberX + fiberY) * 0.5;

    float3 inkColors[5] = {
        float3(0.1, 0.1, 0.35),
        float3(0.6, 0.1, 0.15),
        float3(0.1, 0.3, 0.15),
        float3(0.4, 0.15, 0.5),
        float3(0.05, 0.05, 0.08)
    };

    float2 dropCenters[5] = {
        float2(-0.15, 0.1),
        float2(0.2, -0.05),
        float2(-0.05, -0.2),
        float2(0.25, 0.2),
        float2(-0.25, -0.1)
    };

    float startTimes[5] = { 0.0, 1.5, 3.0, 4.5, 6.0 };

    float3 col = paperColor;

    for (int i = 0; i < 5; i++) {
        float ink = iwInkDrop(uv, dropCenters[i], fmod(t, 12.0), startTimes[i], float(i));

        float wetness = iwFbm(uv * 12.0 + float(i) * 3.0 + t * 0.1) * ink;
        float pigmentVariation = iwFbm(uv * 25.0 + float(i) * 7.0) * 0.3 + 0.7;

        float3 inkCol = inkColors[i] * pigmentVariation;

        float edgeDarken = smoothstep(0.3, 0.0, ink) * ink * 0.3;
        inkCol *= (1.0 + edgeDarken);

        float paperAbsorb = (1.0 - paperNoise * 2.0);
        ink *= paperAbsorb;

        col = mix(col, inkCol, ink * 0.85);
        col = mix(col, inkCol * 0.3, wetness * 0.2);
    }

    float watermark = iwFbm(uv * 4.0 + t * 0.02) * 0.02;
    col += watermark;

    col = pow(col, float3(0.97));

    return float4(col, 1.0);
}
