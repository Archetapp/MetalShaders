#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bhHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float bhStarField(float2 uv, float scale) {
    float2 id = floor(uv * scale);
    float2 f = fract(uv * scale);
    float star = 0.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        float2 neighbor = float2(float(x), float(y));
        float2 point = float2(bhHash(id + neighbor), bhHash(id + neighbor + 71.0));
        float d = length(f - neighbor - point);
        float brightness = bhHash(id + neighbor + 137.0);
        if (brightness > 0.92) {
            star += exp(-d * d * 300.0) * (brightness - 0.92) * 12.5;
        }
    }
    return star;
}

float3 bhStarColor(float2 uv) {
    float h = bhHash(floor(uv * 50.0));
    if (h < 0.3) return float3(0.8, 0.85, 1.0);
    if (h < 0.5) return float3(1.0, 0.95, 0.8);
    if (h < 0.65) return float3(1.0, 0.8, 0.6);
    return float3(0.9, 0.9, 1.0);
}

fragment float4 blackHoleLensFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float2 bhPos = float2(0.0, 0.0);
    float dist = length(uv - bhPos);

    float schwarzschild = 0.08;
    float lensStrength = 0.04;

    float2 dir = normalize(uv - bhPos);
    float deflection = lensStrength / (dist * dist + 0.001);
    deflection = min(deflection, 2.0);

    float2 lensedUV = uv + dir * deflection;

    float starLayer1 = bhStarField(lensedUV + t * 0.01, 30.0);
    float starLayer2 = bhStarField(lensedUV * 1.5 + t * 0.005 + 5.0, 50.0);
    float starLayer3 = bhStarField(lensedUV * 0.7 - t * 0.008 + 10.0, 20.0);

    float3 starColor = bhStarColor(lensedUV);
    float totalStars = starLayer1 + starLayer2 * 0.6 + starLayer3 * 0.3;

    float3 col = float3(0.005, 0.005, 0.015);
    float3 nebulaCol = float3(0.03, 0.01, 0.05) * (bhHash(floor(lensedUV * 5.0)) * 0.5 + 0.5);
    col += nebulaCol;
    col += starColor * totalStars;

    float einsteinRing = abs(dist - schwarzschild * 2.5);
    float ringGlow = exp(-einsteinRing * einsteinRing * 800.0);
    float ringBrightness = 1.0 + 0.3 * sin(t * 2.0);
    col += float3(0.6, 0.7, 1.0) * ringGlow * 0.5 * ringBrightness;

    float diskAngle = atan2(uv.y, uv.x) + t * 0.3;
    float diskR = dist;
    float innerDisk = schwarzschild * 1.5;
    float outerDisk = schwarzschild * 6.0;
    float diskMask = smoothstep(innerDisk, innerDisk + 0.02, diskR) *
                     smoothstep(outerDisk, outerDisk - 0.05, diskR);

    float tilt = abs(uv.y * 2.0 - uv.x * 0.1);
    float diskThin = exp(-tilt * tilt * 80.0);

    float diskSpiral = sin(diskAngle * 3.0 + log(diskR + 0.01) * 8.0 - t * 2.0) * 0.5 + 0.5;
    float diskNoise = sin(diskAngle * 7.0 - t * 5.0) * 0.3 + 0.7;

    float diskBrightness = diskMask * diskThin * diskSpiral * diskNoise;

    float diskTemp = 1.0 - smoothstep(innerDisk, outerDisk, diskR);
    float3 hotColor = float3(1.0, 0.9, 0.7);
    float3 warmColor = float3(1.0, 0.5, 0.2);
    float3 coolColor = float3(0.8, 0.2, 0.1);
    float3 diskColor = mix(coolColor, mix(warmColor, hotColor, diskTemp), diskTemp);

    col += diskColor * diskBrightness * 2.0;

    float eventHorizon = smoothstep(schwarzschild + 0.01, schwarzschild - 0.01, dist);
    col *= (1.0 - eventHorizon);

    float brightening = 1.0 + 2.0 * exp(-(dist - schwarzschild * 2.0) * (dist - schwarzschild * 2.0) * 50.0);
    col *= brightening;

    float jetMask = exp(-abs(uv.x) * 50.0) * smoothstep(schwarzschild, schwarzschild + 0.3, abs(uv.y));
    float jetFade = exp(-abs(uv.y) * 3.0);
    col += float3(0.3, 0.4, 0.8) * jetMask * jetFade * 0.2;

    col = 1.0 - exp(-col * 1.5);
    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
