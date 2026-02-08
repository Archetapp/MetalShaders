#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashRD(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float noiseRD(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hashRD(i), hashRD(i + float2(1.0, 0.0)), f.x),
               mix(hashRD(i + float2(0.0, 1.0)), hashRD(i + float2(1.0, 1.0)), f.x), f.y);
}

float fbmRD(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noiseRD(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 reactionDiffusionFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float t = iTime * 0.15;

    float feed = 0.037;
    float kill = 0.06;

    float2 p = uv * 8.0;

    float n1 = fbmRD(p + t * 0.5);
    float n2 = fbmRD(p * 1.5 - t * 0.3 + n1 * 2.0);
    float n3 = fbmRD(p * 2.5 + n2 * 1.5 + t * 0.2);

    float a = n1;
    float b = smoothstep(0.35, 0.65, n2 + n3 * 0.5);

    float reaction = a * b * b;
    float pattern = b - reaction + feed * (1.0 - a);
    float pattern2 = reaction - b * (kill + feed);

    float v = smoothstep(0.2, 0.8, pattern * 2.0 + pattern2);

    float3 col1 = float3(0.02, 0.05, 0.15);
    float3 col2 = float3(0.1, 0.3, 0.5);
    float3 col3 = float3(0.4, 0.7, 0.6);
    float3 col4 = float3(0.8, 0.9, 0.7);

    float3 col;
    if (v < 0.33) {
        col = mix(col1, col2, v * 3.0);
    } else if (v < 0.66) {
        col = mix(col2, col3, (v - 0.33) * 3.0);
    } else {
        col = mix(col3, col4, (v - 0.66) * 3.0);
    }

    float pulse = sin(t * 5.0 + v * 10.0) * 0.02;
    col += pulse;

    return float4(col, 1.0);
}
