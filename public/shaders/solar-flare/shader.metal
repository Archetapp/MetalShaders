#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float solarNoiseMtl(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, float2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + float2(1.0, 0.0), float2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + float2(0.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + float2(1.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float solarFbmMtl(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * solarNoiseMtl(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 solarFlareFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.uv * iResolution - 0.5 * iResolution) / iResolution.y;
    uv.y += 0.25;
    float3 col = float3(0.0);

    float r = length(uv);
    float sunR = 0.35;
    float sunMask = smoothstep(sunR + 0.01, sunR - 0.01, r);

    float surface = solarFbmMtl(uv * 4.0 + iTime * 0.3);
    float3 sunCol = mix(float3(1.0, 0.6, 0.1), float3(1.0, 0.9, 0.3), surface);
    float granules = solarFbmMtl(uv * 15.0 + iTime * 0.5);
    sunCol *= 0.8 + 0.2 * granules;
    col = mix(col, sunCol, sunMask);

    float corona = exp(-(r - sunR) * 5.0) * step(sunR, r);
    float a = atan2(uv.y, uv.x);
    float coronaRays = pow(abs(sin(a * 6.0 + iTime * 0.5)), 3.0);
    corona *= 0.5 + 0.5 * coronaRays;
    col += float3(1.0, 0.5, 0.1) * corona * 0.4;

    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float flareAngle = fi * 2.0 + iTime * 0.3;
        float flareHeight = 0.15 + 0.1 * sin(iTime * 0.5 + fi);
        float2 flareBase = float2(cos(flareAngle), sin(flareAngle)) * sunR;
        float2 flareTip = flareBase * (1.0 + flareHeight / sunR);

        for (float t = 0.0; t < 1.0; t += 0.02) {
            float2 arcPoint = mix(flareBase, flareTip, t);
            float arcHeight = sin(t * M_PI_F) * flareHeight;
            float2 arcNormal = normalize(float2(-sin(flareAngle), cos(flareAngle)));
            arcPoint += arcNormal * arcHeight;

            float d = length(uv - arcPoint);
            float flare = exp(-d * d * 3000.0);
            float intensity = sin(t * M_PI_F) * (0.5 + 0.5 * sin(iTime * 3.0 + fi));
            col += flare * float3(1.0, 0.4, 0.1) * intensity;
        }
    }

    float glow = exp(-r * 2.0) * 0.3;
    col += float3(1.0, 0.3, 0.05) * glow;

    return float4(col, 1.0);
}
