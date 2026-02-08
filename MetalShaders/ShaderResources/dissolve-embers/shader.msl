#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float dissolveEmberHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float dissolveEmberNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = dissolveEmberHash(i);
    float b = dissolveEmberHash(i + float2(1.0, 0.0));
    float c = dissolveEmberHash(i + float2(0.0, 1.0));
    float d = dissolveEmberHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float dissolveEmberFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
        v += a * dissolveEmberNoise(p);
        p = p * 2.0 + float2(100.0);
        a *= 0.5;
    }
    return v;
}

float dissolveEmberParticle(float2 uv, float2 pos, float sz) {
    float d = length(uv - pos);
    return smoothstep(sz, sz * 0.1, d);
}

fragment float4 dissolveEmbersFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    float2 uvAspect = float2(uv.x * aspect, uv.y);

    float cycleTime = 6.0;
    float t = fmod(iTime, cycleTime);
    float progress = t / cycleTime;

    float2 burnCenter = float2(0.5 * aspect + 0.2 * cos(iTime * 0.3) * aspect,
                               0.5 + 0.2 * sin(iTime * 0.4));

    float distFromCenter = length(uvAspect - burnCenter);

    float noiseVal = dissolveEmberFbm(uv * 5.0);
    float dissolveThreshold = progress * 2.0 - 0.3;
    float burnValue = distFromCenter * 0.8 + noiseVal * 0.4;
    float dissolved = smoothstep(dissolveThreshold - 0.05, dissolveThreshold + 0.05, burnValue);

    float edgeWidth = 0.08;
    float edge = smoothstep(dissolveThreshold - edgeWidth, dissolveThreshold, burnValue) *
                 (1.0 - smoothstep(dissolveThreshold, dissolveThreshold + edgeWidth * 0.5, burnValue));

    float3 contentColor;
    float checker = step(0.5, fract(uv.x * 8.0)) * step(0.5, fract(uv.y * 8.0)) +
                    (1.0 - step(0.5, fract(uv.x * 8.0))) * (1.0 - step(0.5, fract(uv.y * 8.0)));
    float3 pattern1 = mix(float3(0.2, 0.3, 0.6), float3(0.4, 0.5, 0.8), checker);

    float gradient = length(uv - 0.5) * 1.4;
    float3 pattern2 = mix(float3(0.3, 0.6, 0.4), float3(0.1, 0.2, 0.3), gradient);
    contentColor = mix(pattern1, pattern2, 0.5);

    float3 edgeColor1 = float3(1.0, 0.8, 0.2);
    float3 edgeColor2 = float3(1.0, 0.3, 0.05);
    float3 edgeColor3 = float3(0.3, 0.05, 0.0);
    float edgeGradient = smoothstep(dissolveThreshold - edgeWidth, dissolveThreshold, burnValue);
    float3 glowColor = mix(edgeColor1, edgeColor2, edgeGradient);
    glowColor = mix(glowColor, edgeColor3, pow(edgeGradient, 2.0));

    float glowPulse = 0.8 + 0.2 * sin(iTime * 8.0 + noiseVal * 10.0);
    glowColor *= glowPulse;

    float3 col = contentColor * dissolved;
    col += glowColor * edge * 3.0;

    float outerGlow = smoothstep(dissolveThreshold + edgeWidth * 2.0, dissolveThreshold, burnValue) *
                      (1.0 - dissolved);
    col += float3(1.0, 0.4, 0.1) * outerGlow * 0.5;

    for (int i = 0; i < 30; i++) {
        float id = float(i);
        float birthPhase = dissolveEmberHash(float2(id, 0.0));
        float particleTime = fract(iTime * 0.3 + birthPhase);

        float2 birthPos = float2(
            dissolveEmberHash(float2(id * 1.3, 7.0)) * aspect,
            dissolveEmberHash(float2(id * 2.7, 13.0))
        );

        float birthDist = length(birthPos - burnCenter);
        if (birthDist > dissolveThreshold + 0.3 || birthDist < dissolveThreshold - 0.3) continue;

        float2 emberPos = birthPos;
        emberPos.y += particleTime * (0.3 + dissolveEmberHash(float2(id, 3.0)) * 0.3);
        emberPos.x += sin(particleTime * 6.28 + id) * 0.05;

        float sz = 0.004 + dissolveEmberHash(float2(id, 5.0)) * 0.006;
        float fade = (1.0 - particleTime) * smoothstep(0.0, 0.1, particleTime);

        float particle = dissolveEmberParticle(uvAspect, emberPos, sz);

        float3 emberColor = mix(float3(1.0, 0.7, 0.2), float3(1.0, 0.3, 0.05), particleTime);
        col += emberColor * particle * fade * 2.0;
    }

    float3 bgColor = float3(0.02, 0.02, 0.03);
    col = mix(bgColor, col, max(dissolved, max(edge, outerGlow)));
    col += bgColor * (1.0 - dissolved) * (1.0 - edge) * (1.0 - outerGlow);

    return float4(col, 1.0);
}
