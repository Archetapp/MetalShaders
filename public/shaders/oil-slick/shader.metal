#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float osHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float osNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = osHash(i);
    float b = osHash(i + float2(1.0, 0.0));
    float c = osHash(i + float2(0.0, 1.0));
    float d = osHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float osFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * osNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float3 osThinFilm(float thickness) {
    float d = thickness * 2.0;
    float3 col;
    col.r = 0.5 + 0.5 * cos(6.28318 * (d * 1.0 / 650.0));
    col.g = 0.5 + 0.5 * cos(6.28318 * (d * 1.0 / 540.0));
    col.b = 0.5 + 0.5 * cos(6.28318 * (d * 1.0 / 450.0));
    return col * col;
}

fragment float4 oilSlickFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float2 flowUV = uv;
    flowUV += float2(sin(t * 0.3 + uv.y * 2.0), cos(t * 0.2 + uv.x * 2.0)) * 0.05;

    float swirl1 = osFbm(flowUV * 3.0 + t * 0.15);
    float swirl2 = osFbm(flowUV * 2.0 - t * 0.1 + 5.0);
    float swirl3 = osFbm(flowUV * 5.0 + t * 0.08 + 10.0);

    float thickness = swirl1 * 400.0 + swirl2 * 300.0 + swirl3 * 150.0;
    thickness += sin(uv.x * 4.0 + t * 0.5) * 50.0;
    thickness += cos(uv.y * 3.0 + t * 0.3) * 40.0;

    float viewAngle = length(uv) * 0.3 + 0.7;
    thickness *= viewAngle;
    thickness += t * 20.0;

    float3 iridescence = osThinFilm(thickness);

    float waterNoise = osFbm(flowUV * 8.0 + t * 0.2);
    float eps = 0.01;
    float wnx = osFbm((flowUV + float2(eps, 0.0)) * 8.0 + t * 0.2);
    float wny = osFbm((flowUV + float2(0.0, eps)) * 8.0 + t * 0.2);
    float3 waterNormal = normalize(float3(-(wnx - waterNoise) / eps, -(wny - waterNoise) / eps, 1.0));

    float3 lightDir = normalize(float3(0.3, 0.5, 1.0));
    float3 viewDir = float3(0.0, 0.0, 1.0);
    float3 halfDir = normalize(lightDir + viewDir);

    float diff = max(dot(waterNormal, lightDir), 0.0);
    float spec = pow(max(dot(waterNormal, halfDir), 0.0), 48.0);
    float fresnel = pow(1.0 - max(dot(waterNormal, viewDir), 0.0), 4.0);

    float oilMask = smoothstep(0.3, 0.7, osFbm(uv * 2.0 + t * 0.05));
    oilMask = mix(0.4, 1.0, oilMask);

    float3 darkWater = float3(0.02, 0.03, 0.05);
    darkWater += diff * 0.05 * float3(0.1, 0.15, 0.2);
    darkWater += spec * 0.15 * float3(0.5, 0.6, 0.7);

    float3 oilColor = iridescence * 0.6;
    oilColor += spec * 0.3 * float3(1.0, 0.95, 0.9);
    oilColor += fresnel * 0.15 * iridescence;

    float3 col = mix(darkWater, oilColor, oilMask);

    float caustic = pow(max(0.0, sin(uv.x * 20.0 + t + waterNoise * 5.0) *
                                  sin(uv.y * 20.0 + t * 0.7 + waterNoise * 5.0)), 4.0);
    col += caustic * 0.03 * float3(0.5, 0.6, 0.7);

    float vignette = 1.0 - length(uv) * 0.4;
    col *= vignette;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
