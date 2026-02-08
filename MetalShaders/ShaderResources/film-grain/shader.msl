#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hash12Film(float2 p) {
    float3 p3 = fract(float3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float grainFilm(float2 uv, float t) {
    float seed = dot(uv, float2(12.9898, 78.233));
    return fract(sin(seed + t) * 43758.5453);
}

fragment float4 filmGrainFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 fragCoord = uv * iResolution;
    float t = iTime;

    float3 baseColor = float3(0.0);
    float gradY = uv.y;
    baseColor = mix(float3(0.15, 0.08, 0.05), float3(0.05, 0.03, 0.02), gradY);

    float vignette = 1.0 - length((uv - 0.5) * 1.4);
    vignette = smoothstep(0.0, 0.7, vignette);

    float frameT = floor(t * 24.0);

    float g1 = grainFilm(fragCoord, frameT);
    float g2 = grainFilm(fragCoord + 100.0, frameT + 0.5);
    float g3 = grainFilm(fragCoord * 0.5, frameT * 1.3);

    float grainVal = (g1 + g2 + g3) / 3.0;
    grainVal = grainVal * 2.0 - 1.0;

    float intensity = 0.15;
    float3 col = baseColor + grainVal * intensity;

    float scratches = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float scratchX = hash12Film(float2(frameT * 0.1 + fi, fi * 7.0));
        float scratchW = 0.001;
        float s = smoothstep(scratchW, 0.0, abs(uv.x - scratchX));
        s *= step(0.5, hash12Film(float2(frameT + fi, uv.y * 10.0)));
        scratches += s;
    }
    col += scratches * 0.2;

    float flicker = 1.0 + (hash12Film(float2(frameT, 0.0)) - 0.5) * 0.06;
    col *= flicker;

    col *= vignette;

    float dustCount = 5.0;
    for (float i = 0.0; i < dustCount; i++) {
        float2 dustPos = float2(hash12Film(float2(i + frameT * 0.05, i * 3.0)),
                               hash12Film(float2(i * 5.0, frameT * 0.05 + i)));
        float dustSize = hash12Film(float2(i, i)) * 0.003 + 0.001;
        float d = length(uv - dustPos);
        col -= smoothstep(dustSize * 2.0, dustSize, d) * 0.1;
    }

    col += float3(0.02, 0.01, 0.0);

    return float4(clamp(col, 0.0, 1.0), 1.0);
}
