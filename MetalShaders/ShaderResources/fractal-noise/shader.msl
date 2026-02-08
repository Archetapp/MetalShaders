#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hash1(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float noise1(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash1(i);
    float b = hash1(i + float2(1.0, 0.0));
    float c = hash1(i + float2(0.0, 1.0));
    float d = hash1(i + float2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm1(float2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        value += amplitude * noise1(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

fragment float4 fractalNoiseFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float t = iTime * 0.3;

    float n1 = fbm1(uv * 4.0 + float2(t, 0.0));
    float n2 = fbm1(uv * 4.0 + float2(0.0, t * 0.7) + n1 * 2.0);
    float n3 = fbm1(uv * 4.0 + n2 * 1.5);

    float3 col1 = float3(0.1, 0.2, 0.4);
    float3 col2 = float3(0.8, 0.4, 0.1);
    float3 col3 = float3(0.95, 0.9, 0.8);

    float3 col = mix(col1, col2, n2);
    col = mix(col, col3, smoothstep(0.5, 0.8, n3));

    return float4(col, 1.0);
}
