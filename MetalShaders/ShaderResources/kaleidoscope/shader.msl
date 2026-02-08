#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashKal(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float noiseKal(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hashKal(i), hashKal(i + float2(1.0, 0.0)), f.x),
               mix(hashKal(i + float2(0.0, 1.0)), hashKal(i + float2(1.0, 1.0)), f.x), f.y);
}

float fbmKal(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noiseKal(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 kaleidoscopeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.3;

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float segments = 6.0;
    float segAngle = M_PI_F * 2.0 / segments;
    a = fmod(a + M_PI_F * 2.0, segAngle);
    if (a > segAngle * 0.5) a = segAngle - a;

    float2 p = float2(cos(a), sin(a)) * r;
    p += t * 0.3;

    float n1 = fbmKal(p * 3.0 + t * 0.5);
    float n2 = fbmKal(p * 5.0 - t * 0.3 + n1 * 2.0);
    float n3 = fbmKal(p * 8.0 + n2 * 1.5);

    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    float3 col;
    col.r = sin(pattern * 6.0 + t + 0.0) * 0.5 + 0.5;
    col.g = sin(pattern * 6.0 + t + 2.1) * 0.5 + 0.5;
    col.b = sin(pattern * 6.0 + t + 4.2) * 0.5 + 0.5;

    col *= 0.6 + 0.4 * sin(r * 8.0 - t * 2.0);

    float vignette = 1.0 - r * 0.8;
    col *= max(vignette, 0.0);

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
