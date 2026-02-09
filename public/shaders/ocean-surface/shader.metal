#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float oceanHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float oceanNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = oceanHash(i);
    float b = oceanHash(i + float2(1.0, 0.0));
    float c = oceanHash(i + float2(0.0, 1.0));
    float d = oceanHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float oceanWaves(float2 p, float t) {
    float wave = 0.0;
    float freq = 1.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
        float angle = float(i) * 0.9 + 0.3;
        float2 dir = float2(cos(angle), sin(angle));
        float phase = dot(p, dir) * freq - t * (1.0 + float(i) * 0.2);
        wave += sin(phase) * amp;
        wave += sin(phase * 1.3 + t * 0.5) * amp * 0.3;
        freq *= 1.7;
        amp *= 0.5;
    }
    return wave;
}

fragment float4 oceanSurfaceFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float t = iTime * 0.8;

    float horizon = 0.4;

    if (uv.y > horizon + 0.01) {
        float skyT = (uv.y - horizon) / (1.0 - horizon);
        float3 skyLow = float3(0.8, 0.55, 0.4);
        float3 skyHigh = float3(0.2, 0.35, 0.65);
        float3 sky = mix(skyLow, skyHigh, skyT);

        float2 sunPos = float2(0.5, horizon + 0.05);
        float sunDist = length(uv - sunPos);
        sky += float3(1.0, 0.7, 0.3) * exp(-sunDist * 8.0) * 0.6;

        return float4(sky, 1.0);
    }

    float depth = max(0.001, horizon - uv.y);
    float perspScale = 1.0 / depth;
    float2 worldPos = float2((uv.x - 0.5) * perspScale * 2.0, perspScale * 0.5);

    float wave = oceanWaves(worldPos * 0.3, t);
    float waveDetail = oceanNoise(worldPos * 3.0 + t * 0.3) * 0.1;
    wave += waveDetail;

    float nx = oceanWaves((worldPos + float2(0.01, 0.0)) * 0.3, t) - wave;
    float ny = oceanWaves((worldPos + float2(0.0, 0.01)) * 0.3, t) - wave;
    float3 normal = normalize(float3(-nx * 30.0, 1.0, -ny * 30.0));

    float3 viewDir = normalize(float3(uv.x - 0.5, 0.3, -1.0));
    float fresnel = pow(1.0 - max(dot(normal, float3(0.0, 1.0, 0.0)), 0.0), 3.0);
    fresnel = mix(0.1, 1.0, fresnel);

    float3 deepColor = float3(0.0, 0.05, 0.15);
    float3 shallowColor = float3(0.0, 0.25, 0.35);
    float3 waterColor = mix(deepColor, shallowColor, clamp(wave * 0.5 + 0.5, 0.0, 1.0));

    float3 skyReflect = float3(0.4, 0.5, 0.7);
    float3 col = mix(waterColor, skyReflect, fresnel);

    float3 sunDir = normalize(float3(0.0, 0.3, -1.0));
    float3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 120.0);
    col += float3(1.0, 0.85, 0.6) * spec * 2.0;

    float foam = smoothstep(0.35, 0.5, wave + waveDetail * 2.0);
    col = mix(col, float3(0.9, 0.95, 1.0), foam * 0.4);

    float depthFade = smoothstep(0.0, 0.15, depth);
    col = mix(float3(0.8, 0.55, 0.4), col, depthFade);

    return float4(col, 1.0);
}
