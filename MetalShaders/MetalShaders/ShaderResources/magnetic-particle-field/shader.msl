#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float magParticleHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 magParticleHash2(float2 p) {
    return float2(magParticleHash(p), magParticleHash(p + float2(37.0, 91.0)));
}

fragment float4 magneticParticleFieldFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float2 magnetPos = float2(sin(iTime * 0.6) * 0.3, cos(iTime * 0.8) * 0.3);

    float3 col = float3(0.02, 0.01, 0.04);

    for (int i = 0; i < 80; i++) {
        float2 seed = float2(float(i) * 1.23, float(i) * 2.47);
        float2 basePos = (magParticleHash2(seed) - 0.5) * 1.2;

        float2 toMagnet = magnetPos - basePos;
        float dist = length(toMagnet);
        float2 dir = normalize(toMagnet);

        float orbitAngle = atan2(toMagnet.y, toMagnet.x) + iTime * (0.5 + magParticleHash(seed + 10.0));
        float orbitRadius = 0.05 + dist * 0.3;
        float2 orbit = float2(cos(orbitAngle), sin(orbitAngle)) * orbitRadius;

        float attraction = exp(-dist * 2.0) * 0.3;
        float2 particlePos = basePos + dir * attraction + orbit * (1.0 - attraction);

        float particleDist = length(uv - particlePos);
        float brightness = magParticleHash(seed + 20.0);

        float glow = exp(-particleDist * 60.0) * (0.5 + brightness * 0.5);
        float core = exp(-particleDist * 200.0) * 1.5;

        float hue = magParticleHash(seed + 30.0) * 0.3 + 0.55;
        float3 particleColor = 0.5 + 0.5 * cos(6.28 * (hue + float3(0.0, 0.33, 0.67)));

        col += particleColor * glow + float3(1.0) * core;
    }

    float fieldLines = 0.0;
    for (int i = 0; i < 8; i++) {
        float angle = float(i) * 0.785 + iTime * 0.2;
        float2 dir = float2(cos(angle), sin(angle));
        float lineField = abs(dot(uv - magnetPos, dir));
        lineField = exp(-lineField * 30.0) * exp(-length(uv - magnetPos) * 3.0);
        fieldLines += lineField;
    }
    col += fieldLines * float3(0.1, 0.15, 0.3);

    float centerGlow = exp(-length(uv - magnetPos) * 8.0) * 0.15;
    col += centerGlow * float3(0.3, 0.4, 0.8);

    col = pow(col, float3(0.85));
    return float4(col, 1.0);
}
