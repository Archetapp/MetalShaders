#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 faHash3(float3 p) {
    p = float3(dot(p, float3(127.1, 311.7, 74.7)),
               dot(p, float3(269.5, 183.3, 246.1)),
               dot(p, float3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float faNoise(float3 p) {
    float3 i = floor(p);
    float3 f = fract(p);
    float3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(dot(faHash3(i + float3(0, 0, 0)), f - float3(0, 0, 0)),
                       dot(faHash3(i + float3(1, 0, 0)), f - float3(1, 0, 0)), u.x),
                   mix(dot(faHash3(i + float3(0, 1, 0)), f - float3(0, 1, 0)),
                       dot(faHash3(i + float3(1, 1, 0)), f - float3(1, 1, 0)), u.x), u.y),
               mix(mix(dot(faHash3(i + float3(0, 0, 1)), f - float3(0, 0, 1)),
                       dot(faHash3(i + float3(1, 0, 1)), f - float3(1, 0, 1)), u.x),
                   mix(dot(faHash3(i + float3(0, 1, 1)), f - float3(0, 1, 1)),
                       dot(faHash3(i + float3(1, 1, 1)), f - float3(1, 1, 1)), u.x), u.y), u.z);
}

float faFbm(float3 p) {
    float v = 0.0;
    float a = 0.5;
    float3 shift = float3(100.0);
    for (int i = 0; i < 5; i++) {
        v += a * faNoise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float2 faCurlNoise(float2 p, float t) {
    float eps = 0.01;
    float n1 = faFbm(float3(p.x, p.y + eps, t));
    float n2 = faFbm(float3(p.x, p.y - eps, t));
    float n3 = faFbm(float3(p.x + eps, p.y, t));
    float n4 = faFbm(float3(p.x - eps, p.y, t));
    return float2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

float3 faColorPalette(float t) {
    float3 a = float3(0.5, 0.5, 0.5);
    float3 b = float3(0.5, 0.5, 0.5);
    float3 c = float3(1.0, 1.0, 1.0);
    float3 d = float3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

fragment float4 fluidAdvectionFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime * 0.15;

    float2 p = uv * 2.0;

    float2 advected = p;
    for (int i = 0; i < 6; i++) {
        float2 curl = faCurlNoise(advected * 0.8, t + float(i) * 0.1);
        advected += curl * 0.15;
    }

    float n1 = faFbm(float3(advected * 1.5, t));
    float n2 = faFbm(float3(advected * 1.5 + 5.0, t + 10.0));
    float n3 = faFbm(float3(advected * 1.5 + 10.0, t + 20.0));

    float2 warp = float2(n1, n2) * 2.0;
    float pattern = faFbm(float3(advected + warp, t));
    float pattern2 = faFbm(float3(advected * 2.0 + warp * 0.5, t * 1.3));

    float3 col1 = faColorPalette(pattern * 0.5 + t * 0.2);
    float3 col2 = faColorPalette(pattern2 * 0.5 + t * 0.3 + 0.5);
    float3 col3 = faColorPalette(n3 * 0.7 + t * 0.1 + 0.3);

    float3 col = mix(col1, col2, smoothstep(-0.2, 0.2, pattern));
    col = mix(col, col3, smoothstep(-0.1, 0.3, pattern2) * 0.5);

    float edge = length(faCurlNoise(advected, t)) * 2.0;
    col += float3(0.2, 0.1, 0.3) * edge;

    col *= 0.8 + 0.2 * pattern;
    col = pow(col, float3(0.9));
    col *= 1.0 - 0.25 * length(uv);

    return float4(col, 1.0);
}
