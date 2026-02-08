#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float dtHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float dtNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(dtHash(i), dtHash(i + float2(1.0, 0.0)), f.x),
               mix(dtHash(i + float2(0.0, 1.0)), dtHash(i + float2(1.0, 1.0)), f.x), f.y);
}

float dtFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
        v += a * dtNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float3 dtPattern1(float2 uv, float t) {
    float angle = atan2(uv.y, uv.x);
    float r = length(uv);
    float spiral = sin(angle * 5.0 + r * 10.0 - t * 3.0);
    float3 col = 0.5 + 0.5 * cos(float3(0.0, 2.0, 4.0) + spiral * 3.0 + t);
    col *= 0.8 + 0.2 * sin(r * 20.0 - t * 2.0);
    return col;
}

float3 dtPattern2(float2 uv, float t) {
    float2 grid = fract(uv * 5.0) - 0.5;
    float2 id = floor(uv * 5.0);
    float d = length(grid);
    float phase = dtHash(id) * 6.28 + t * 2.0;
    float sz = 0.3 + 0.15 * sin(phase);
    float shape = smoothstep(sz, sz - 0.05, d);
    float3 col = 0.5 + 0.5 * cos(float3(2.0, 4.0, 6.0) + dtHash(id + 42.0) * 6.0 + t);
    return col * shape + float3(0.05) * (1.0 - shape);
}

fragment float4 dissolveTransitionFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float progress = sin(t * 0.5) * 0.5 + 0.5;

    float noise = dtFbm(uv * 4.0);
    float noise2 = dtFbm(uv * 8.0 + 100.0);
    float combinedNoise = noise * 0.7 + noise2 * 0.3;

    float threshold = progress;

    float dissolve = smoothstep(threshold - 0.01, threshold + 0.01, combinedNoise);

    float3 col1 = dtPattern1(uv, t);
    float3 col2 = dtPattern2(uv, t);

    float3 col = mix(col1, col2, dissolve);

    float edgeDist = abs(combinedNoise - threshold);
    float edgeWidth = 0.04;
    float edge = smoothstep(edgeWidth, 0.0, edgeDist);

    float3 edgeColor1 = float3(1.0, 0.8, 0.2);
    float3 edgeColor2 = float3(1.0, 0.3, 0.1);
    float3 edgeColor = mix(edgeColor1, edgeColor2, sin(t * 3.0 + combinedNoise * 10.0) * 0.5 + 0.5);

    col += edgeColor * edge * 2.0;
    col += edgeColor * exp(-edgeDist * 30.0) * 0.5;

    float innerEdge = smoothstep(edgeWidth * 0.5, 0.0, edgeDist);
    col += float3(1.0, 1.0, 0.9) * innerEdge * 1.5;

    float vig = 1.0 - 0.25 * dot(uv, uv);
    col *= vig;

    col = col / (col + 0.7);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
