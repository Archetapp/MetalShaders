#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float elArcHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float elArcNoise(float p) {
    float i = floor(p);
    float f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(elArcHash(i), elArcHash(i + 1.0), f);
}

float elArcLightning(float2 uv, float2 a, float2 b, float seed, float width, float iTime) {
    float2 ab = b - a;
    float len = length(ab);
    float2 dir = ab / len;
    float2 perp = float2(-dir.y, dir.x);

    float proj = dot(uv - a, dir);
    float t = clamp(proj / len, 0.0, 1.0);

    float offset = 0.0;
    float amp = 0.08;
    for (int i = 0; i < 6; i++) {
        float freq = pow(2.0, float(i)) * 3.0;
        float timeShift = iTime * (8.0 + float(i) * 2.0);
        offset += amp * (elArcNoise(t * freq + seed + timeShift) - 0.5);
        amp *= 0.6;
    }

    float2 boltPoint = a + dir * proj + perp * offset;
    float dist = length(uv - boltPoint);

    float glow = width / (dist + 0.001);
    glow *= smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);

    return glow;
}

fragment float4 electricLightningArcFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float2 pointA = float2(-0.35, sin(iTime * 0.3) * 0.15);
    float2 pointB = float2(0.35, cos(iTime * 0.4) * 0.15);

    float3 col = float3(0.02, 0.01, 0.04);

    float totalGlow = 0.0;
    for (int i = 0; i < 5; i++) {
        float seed = float(i) * 17.3 + floor(iTime * 4.0) * 7.1;
        float width = 0.003 - float(i) * 0.0004;
        float brightness = 1.0 - float(i) * 0.15;
        float bolt = elArcLightning(uv, pointA, pointB, seed, width, iTime);
        totalGlow += bolt * brightness;

        if (i < 2) {
            float branchT = 0.3 + float(i) * 0.3;
            float2 branchStart = mix(pointA, pointB, branchT);
            float branchAngle = (elArcHash(seed + 50.0) - 0.5) * 1.5;
            float2 branchEnd = branchStart + float2(cos(branchAngle), sin(branchAngle)) * 0.15;
            float branch = elArcLightning(uv, branchStart, branchEnd, seed + 100.0, width * 0.7, iTime);
            totalGlow += branch * brightness * 0.5;
        }
    }

    float3 boltColor = float3(0.4, 0.6, 1.0);
    float3 coreColor = float3(0.8, 0.9, 1.0);

    col += boltColor * totalGlow * 0.1;
    col += coreColor * pow(totalGlow * 0.05, 2.0);

    float glowA = exp(-length(uv - pointA) * 8.0) * 0.3;
    float glowB = exp(-length(uv - pointB) * 8.0) * 0.3;
    col += float3(0.3, 0.5, 1.0) * (glowA + glowB);

    float flicker = 0.8 + 0.2 * sin(iTime * 30.0);
    col *= flicker;

    col = pow(col, float3(0.85));
    return float4(col, 1.0);
}
