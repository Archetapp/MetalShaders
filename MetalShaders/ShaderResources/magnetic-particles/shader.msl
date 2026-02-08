#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float magnetFieldHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 magnetFieldHash2(float2 p) {
    return float2(fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453),
                  fract(sin(dot(p, float2(269.5, 183.3))) * 43758.5453));
}

fragment float4 magneticParticlesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    float2 p = (uv - 0.5) * float2(aspect, 1.0);

    float2 attractor = float2(
        0.3 * cos(iTime * 0.5) * sin(iTime * 0.3),
        0.3 * sin(iTime * 0.4) * cos(iTime * 0.2)
    );

    float2 attractor2 = float2(
        0.2 * cos(iTime * 0.7 + 2.0),
        0.2 * sin(iTime * 0.6 + 1.0)
    );

    float3 col = float3(0.01, 0.01, 0.02);

    float glow1 = exp(-length(p - attractor) * 8.0) * 0.3;
    float glow2 = exp(-length(p - attractor2) * 8.0) * 0.2;
    col += float3(0.3, 0.5, 1.0) * glow1;
    col += float3(1.0, 0.3, 0.5) * glow2;

    float totalBrightness = 0.0;
    float3 particleColor = float3(0.0);

    for (int i = 0; i < 200; i++) {
        float id = float(i);
        float2 seed = float2(id * 0.73, id * 1.37);

        float2 basePos = magnetFieldHash2(seed) * 2.0 - 1.0;
        basePos *= 0.6;

        float angle = atan2(basePos.y - attractor.y, basePos.x - attractor.x);
        float dist = length(basePos - attractor);

        float orbitSpeed = 1.0 / (dist + 0.1);
        float currentAngle = angle + iTime * orbitSpeed * 0.3 + id * 0.1;

        float spiralFactor = 0.02 * sin(iTime * 0.5 + id);
        float currentDist = dist + spiralFactor;
        currentDist *= 0.5 + 0.5 * sin(iTime * 0.2 + id * 0.5);
        currentDist = max(currentDist, 0.02);

        float2 particlePos = attractor + float2(cos(currentAngle), sin(currentAngle)) * currentDist;

        float dist2 = length(basePos - attractor2);
        float influence2 = exp(-dist2 * 3.0) * 0.3;
        float2 toAttractor2 = normalize(attractor2 - particlePos);
        particlePos += toAttractor2 * influence2 * 0.1 * sin(iTime + id);

        float d = length(p - particlePos);
        float sz = 0.002 + magnetFieldHash(seed * 3.0) * 0.003;
        float brightness = smoothstep(sz * 3.0, 0.0, d);
        brightness *= 0.5 + 0.5 * sin(iTime * 2.0 + id * 0.7);

        float hue = fract(id * 0.13 + iTime * 0.05);
        float3 pCol;
        if (hue < 0.33) {
            pCol = mix(float3(0.3, 0.5, 1.0), float3(0.5, 0.3, 1.0), hue * 3.0);
        } else if (hue < 0.66) {
            pCol = mix(float3(0.5, 0.3, 1.0), float3(1.0, 0.3, 0.6), (hue - 0.33) * 3.0);
        } else {
            pCol = mix(float3(1.0, 0.3, 0.6), float3(0.3, 0.5, 1.0), (hue - 0.66) * 3.0);
        }

        particleColor += pCol * brightness;
        totalBrightness += brightness;
    }

    col += particleColor * 1.5;

    for (int i = 0; i < 50; i++) {
        float id = float(i) + 200.0;
        float2 seed = float2(id * 0.53, id * 1.17);
        float2 basePos = magnetFieldHash2(seed) * 2.0 - 1.0;
        basePos *= 0.4;

        float angle = atan2(basePos.y - attractor2.y, basePos.x - attractor2.x);
        float dist = length(basePos - attractor2);
        float orbitSpeed = 1.0 / (dist + 0.1);
        float currentAngle = angle - iTime * orbitSpeed * 0.4 + id * 0.1;
        float currentDist = dist * (0.3 + 0.7 * sin(iTime * 0.3 + id * 0.3));
        currentDist = max(currentDist, 0.015);

        float2 particlePos = attractor2 + float2(cos(currentAngle), sin(currentAngle)) * currentDist;

        float d = length(p - particlePos);
        float sz = 0.003;
        float brightness = smoothstep(sz * 2.5, 0.0, d) * 0.7;

        col += float3(1.0, 0.5, 0.7) * brightness;
    }

    col += float3(0.05, 0.08, 0.15) * (1.0 - length(p) * 0.8);

    col = 1.0 - exp(-col * 2.0);

    return float4(col, 1.0);
}
