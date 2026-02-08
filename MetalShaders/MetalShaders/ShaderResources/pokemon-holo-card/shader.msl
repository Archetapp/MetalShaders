#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float holoCardHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float holoCardNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = holoCardHash(i);
    float b = holoCardHash(i + float2(1.0, 0.0));
    float c = holoCardHash(i + float2(0.0, 1.0));
    float d = holoCardHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float holoCardFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2 shift = float2(100.0);
    for (int i = 0; i < 5; i++) {
        v += a * holoCardNoise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float3 holoCardRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + float3(0.0, 0.33, 0.67)));
}

fragment float4 pokemonHoloCardFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centeredUv = uv * 2.0 - 1.0;
    centeredUv.x *= iResolution.x / iResolution.y;

    float viewAngleX = sin(iTime * 0.7) * 0.5;
    float viewAngleY = cos(iTime * 0.5) * 0.3;
    float3 viewDir = normalize(float3(viewAngleX, viewAngleY, 1.0));

    float noiseVal = holoCardFbm(uv * 4.0 + iTime * 0.1);
    float2 distortedUv = uv + float2(noiseVal * 0.05, noiseVal * 0.03);

    float diffraction = dot(distortedUv, viewDir.xy) * 8.0;
    diffraction += noiseVal * 2.0;

    float3 rainbow1 = holoCardRainbow(diffraction + iTime * 0.3);
    float3 rainbow2 = holoCardRainbow(diffraction * 1.5 - iTime * 0.2 + 0.5);

    float gratingPattern = sin(distortedUv.x * 120.0 + viewAngleX * 40.0) * 0.5 + 0.5;
    gratingPattern *= sin(distortedUv.y * 80.0 + viewAngleY * 30.0) * 0.5 + 0.5;

    float sparkle = pow(holoCardNoise(uv * 30.0 + iTime * 0.5), 8.0) * 2.0;

    float3 baseColor = float3(0.85, 0.85, 0.88);
    float3 holoColor = mix(rainbow1, rainbow2, gratingPattern);

    float fresnelLike = 1.0 - abs(dot(normalize(float3(centeredUv, 0.0)), viewDir));
    fresnelLike = pow(fresnelLike, 2.0);

    float holoStrength = 0.5 + 0.3 * sin(iTime * 0.4) + fresnelLike * 0.3;

    float3 col = mix(baseColor, holoColor, holoStrength);
    col += sparkle * holoColor;

    float specular = pow(max(dot(reflect(-viewDir, float3(0.0, 0.0, 1.0)), float3(0.0, 0.0, 1.0)), 0.0), 32.0);
    col += float3(specular * 0.5);

    float cardBorder = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, uv.y) *
                       smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.y);
    col *= cardBorder;

    float cornerRadius = 0.03;
    float2 cornerDist = max(abs(centeredUv) - (float2(iResolution.x / iResolution.y, 1.0) - cornerRadius), 0.0);
    float cornerMask = 1.0 - smoothstep(cornerRadius - 0.01, cornerRadius, length(cornerDist));
    col *= cornerMask;

    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
