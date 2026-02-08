#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hash21Star(float2 p) {
    p = fract(p * float2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float3 starLayer(float2 uv, float scale, float speed, float brightness, float time) {
    float3 col = float3(0.0);
    float t = time * speed;

    uv *= scale;
    float2 id = floor(uv);
    float2 gv = fract(uv) - 0.5;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            float2 offs = float2(float(x), float(y));
            float2 cellId = id + offs;
            float rnd = hash21Star(cellId);

            if (rnd > 0.6) continue;

            float2 starPos = float2(hash21Star(cellId + 100.0), hash21Star(cellId + 200.0)) - 0.5;
            float d = length(gv - offs - starPos);

            float twinkle = sin(t * (2.0 + rnd * 4.0) + rnd * 6.28) * 0.5 + 0.5;
            twinkle = mix(0.5, 1.0, twinkle);

            float star = brightness * twinkle / (d * 40.0 + 1.0);
            star = max(star - 0.01, 0.0);

            float colorSeed = hash21Star(cellId + 300.0);
            float3 starCol;
            if (colorSeed < 0.3) {
                starCol = float3(0.8, 0.85, 1.0);
            } else if (colorSeed < 0.6) {
                starCol = float3(1.0, 0.95, 0.8);
            } else {
                starCol = float3(1.0, 0.8, 0.7);
            }

            col += starCol * star;
        }
    }
    return col;
}

fragment float4 starfieldFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;

    float drift = iTime * 0.02;

    float3 col = float3(0.0);
    float3 bg = mix(float3(0.0, 0.0, 0.02), float3(0.02, 0.0, 0.04), uv.y * 0.5 + 0.5);
    col += bg;

    col += starLayer(uv + drift * 0.3, 8.0, 0.3, 0.3, iTime);
    col += starLayer(uv + drift * 0.5, 15.0, 0.5, 0.5, iTime);
    col += starLayer(uv + drift * 0.8, 25.0, 0.7, 0.7, iTime);
    col += starLayer(uv + drift * 1.0, 40.0, 1.0, 1.0, iTime);

    float nebula = sin(uv.x * 3.0 + iTime * 0.1) * cos(uv.y * 2.0 - iTime * 0.05);
    nebula = smoothstep(0.3, 0.9, nebula * 0.5 + 0.5);
    col += float3(0.1, 0.02, 0.15) * nebula * 0.3;

    return float4(col, 1.0);
}
