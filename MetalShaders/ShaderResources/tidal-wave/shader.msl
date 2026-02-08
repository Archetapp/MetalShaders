#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float twHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float twNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = twHash(i);
    float b = twHash(i + float2(1.0, 0.0));
    float c = twHash(i + float2(0.0, 1.0));
    float d = twHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float twFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * twNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float twOceanHeight(float2 p, float t) {
    float h = 0.0;
    h += sin(p.x * 1.0 + t * 1.2) * 0.25;
    h += sin(p.x * 2.5 + p.y * 0.8 + t * 1.8) * 0.12;
    h += sin(p.x * 4.0 - p.y * 1.5 + t * 2.5) * 0.06;
    h += sin(p.y * 3.0 + p.x * 1.2 + t * 1.0) * 0.08;

    float bigWave = sin(p.x * 0.3 + t * 0.6) * 0.4;
    bigWave *= smoothstep(-0.5, 0.2, p.y);
    h += bigWave;

    float crest = pow(max(0.0, sin(p.x * 0.8 + t * 1.0)), 3.0) * 0.3;
    h += crest;

    h += twFbm(p * 3.0 + t * 0.5) * 0.05;
    h += twFbm(p * 8.0 + t * 0.3) * 0.02;

    return h;
}

fragment float4 tidalWaveFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float perspY = uv.y - 0.1;
    float perspective = 1.0 / (perspY * 2.0 + 1.5);
    float2 worldPos = float2(uv.x * perspective * 5.0, perspective * 8.0);
    worldPos.y += t * 1.5;

    float skyMask = smoothstep(0.1, 0.15, uv.y);

    float h = twOceanHeight(worldPos, t);

    float eps = 0.01;
    float hx = twOceanHeight(worldPos + float2(eps, 0.0), t);
    float hy = twOceanHeight(worldPos + float2(0.0, eps), t);
    float3 normal = normalize(float3(-(hx - h) / eps * 0.3, 1.0, -(hy - h) / eps * 0.3));

    float3 sunDir = normalize(float3(0.3, 0.6, -0.5));
    float3 viewDir = normalize(float3(0.0, 0.3, -1.0));

    float diff = max(dot(normal, sunDir), 0.0);
    float3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 120.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    float3 deepColor = float3(0.0, 0.05, 0.15);
    float3 shallowColor = float3(0.0, 0.2, 0.3);
    float3 foamColor = float3(0.8, 0.85, 0.9);

    float depthFactor = smoothstep(-0.3, 0.3, h);
    float3 waterColor = mix(deepColor, shallowColor, depthFactor);

    float3 col = waterColor * 0.3;
    col += waterColor * diff * 0.5;
    col += float3(1.0, 0.9, 0.7) * spec * 1.5;
    col += float3(0.5, 0.6, 0.7) * fresnel * 0.3;

    float foam = smoothstep(0.35, 0.5, h);
    foam += smoothstep(0.9, 1.0, twFbm(worldPos * 5.0 + t * 0.8)) * 0.3;
    foam = clamp(foam, 0.0, 1.0);
    col = mix(col, foamColor, foam * 0.7);

    float sss = pow(max(0.0, dot(viewDir, -sunDir + normal * 0.5)), 3.0) * 0.15;
    col += float3(0.0, 0.3, 0.2) * sss;

    float spray = pow(twFbm(worldPos * 10.0 + t * 2.0), 3.0) * foam * 0.3;
    col += float3(0.9) * spray;

    float3 skyColor = mix(float3(0.7, 0.4, 0.3), float3(0.2, 0.3, 0.6), smoothstep(0.1, 0.5, uv.y));
    float sunGlow = pow(max(0.0, dot(normalize(float3(uv.x, uv.y - 0.3, 0.5)), sunDir)), 32.0);
    skyColor += float3(1.0, 0.8, 0.5) * sunGlow;

    col = mix(skyColor, col, skyMask);

    float sunReflection = pow(max(0.0, 1.0 - length(uv - float2(0.15, -0.1)) * 3.0), 2.0) * skyMask;
    col += float3(1.0, 0.8, 0.5) * sunReflection * 0.3;

    col = pow(col, float3(0.95));
    col = col * 1.05 - 0.02;
    col = clamp(col, 0.0, 1.0);

    return float4(col, 1.0);
}
