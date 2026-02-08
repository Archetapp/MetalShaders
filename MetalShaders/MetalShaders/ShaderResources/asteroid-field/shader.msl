#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float astHashMtl(float n) { return fract(sin(n) * 43758.5453); }

float asteroidSDFMtl(float2 p, float seed) {
    float a = atan2(p.y, p.x);
    float r = length(p);
    float bumps = 1.0 + 0.3 * sin(a * 5.0 + seed * 10.0) + 0.15 * sin(a * 8.0 + seed * 20.0);
    return r - 0.04 * bumps;
}

fragment float4 asteroidFieldFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.015);

    for (int i = 0; i < 40; i++) {
        float fi = float(i);
        float seed = astHashMtl(fi * 13.37);
        float depth = astHashMtl(fi * 7.71);
        float size = 0.02 + astHashMtl(fi * 3.31) * 0.04;
        size *= (0.3 + depth * 0.7);

        float speed = 0.1 + depth * 0.2;
        float x = fmod(astHashMtl(fi * 17.13) + iTime * speed * (astHashMtl(fi * 5.5) - 0.5), 1.4) - 0.7;
        float y = fmod(astHashMtl(fi * 23.17) + iTime * speed * 0.3 * (astHashMtl(fi * 9.1) - 0.5), 1.0) - 0.5;
        float2 pos = float2(x, y);

        float rotation = iTime * (0.5 + astHashMtl(fi * 11.3) * 2.0);
        float c = cos(rotation), s = sin(rotation);
        float2 localUV = uv - pos;
        localUV = float2(c * localUV.x - s * localUV.y, s * localUV.x + c * localUV.y);
        localUV /= size;

        float d = asteroidSDFMtl(localUV, seed);
        float astMask = smoothstep(0.02, -0.02, d);

        float3 lightDir = normalize(float3(0.5, 0.7, 1.0));
        float nx = asteroidSDFMtl(localUV + float2(0.01, 0.0), seed) - d;
        float ny = asteroidSDFMtl(localUV + float2(0.0, 0.01), seed) - d;
        float3 normal = normalize(float3(-nx, -ny, 0.02));
        float lighting = max(dot(normal, lightDir), 0.0);

        float3 astCol = mix(float3(0.25, 0.22, 0.18), float3(0.45, 0.4, 0.35), astHashMtl(fi * 31.1));
        astCol *= 0.3 + 0.7 * lighting;
        astCol *= (0.5 + depth * 0.5);

        col = mix(col, astCol, astMask);
    }

    for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float2 sp = float2(astHashMtl(fi * 73.1 + 100.0) - 0.5, astHashMtl(fi * 91.3 + 100.0) - 0.5);
        col += exp(-length(uv - sp) * length(uv - sp) * 5000.0) * float3(0.6, 0.65, 0.8) * 0.3;
    }

    return float4(col, 1.0);
}
