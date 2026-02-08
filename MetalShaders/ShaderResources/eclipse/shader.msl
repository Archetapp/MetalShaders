#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float eclipseNoiseMtl(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 eclipseFragment(VertexOut in [[stage_in]],
                                 constant float &iTime [[buffer(0)]],
                                 constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.002, 0.002, 0.01);

    float sunR = 0.2;
    float moonR = 0.19;
    float moonOffset = sin(iTime * 0.3) * 0.15;
    float2 moonPos = float2(moonOffset, moonOffset * 0.3);

    float sunDist = length(uv);
    float moonDist = length(uv - moonPos);

    float sunMask = smoothstep(sunR + 0.005, sunR - 0.005, sunDist);
    float moonMask = smoothstep(moonR + 0.003, moonR - 0.003, moonDist);

    col += float3(1.0, 0.9, 0.6) * sunMask;

    float a = atan2(uv.y, uv.x);
    float corona = exp(-(sunDist - sunR) * 8.0) * step(sunR * 0.95, sunDist);
    float coronaRays = pow(abs(sin(a * 6.0 + iTime * 0.3)), 2.0);
    corona *= 0.5 + 0.5 * coronaRays;
    corona *= (1.0 - moonMask * 0.7);
    col += float3(1.0, 0.8, 0.5) * corona * 0.6;

    float outerCorona = exp(-(sunDist - sunR) * 3.0) * step(sunR, sunDist);
    col += float3(0.4, 0.3, 0.5) * outerCorona * 0.3;

    col *= (1.0 - moonMask);
    col += float3(0.02, 0.02, 0.03) * moonMask;

    float rimLight = smoothstep(moonR + 0.01, moonR - 0.005, moonDist) *
                     smoothstep(moonR - 0.02, moonR - 0.005, moonDist);
    float rimDir = dot(normalize(uv - moonPos), normalize(-moonPos));
    rimLight *= smoothstep(-0.5, 0.5, rimDir);
    col += float3(1.0, 0.7, 0.4) * rimLight * 2.0;

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float2 sp = float2(eclipseNoiseMtl(float2(fi, 0.0)) - 0.5, eclipseNoiseMtl(float2(0.0, fi)) - 0.5);
        float d = length(uv - sp);
        float twinkle = 0.5 + 0.5 * sin(iTime * 2.0 + fi * 5.0);
        col += exp(-d * d * 6000.0) * float3(0.7, 0.75, 0.9) * 0.3 * twinkle;
    }

    return float4(col, 1.0);
}
