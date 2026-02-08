#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float nebNoiseMtl(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, float2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + float2(1.0, 0.0), float2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + float2(0.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + float2(1.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float nebFbmMtl(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * nebNoiseMtl(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

fragment float4 nebulaFragment(VertexOut in [[stage_in]],
                                constant float &iTime [[buffer(0)]],
                                constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.02);

    float t = iTime * 0.05;
    float n1 = nebFbmMtl(uv * 3.0 + t);
    float n2 = nebFbmMtl(uv * 2.0 - t * 0.7 + 5.0);
    float n3 = nebFbmMtl(uv * 4.0 + t * 0.3 + 10.0);

    float3 layer1 = float3(0.5, 0.1, 0.3) * pow(n1, 1.5) * 1.2;
    float3 layer2 = float3(0.1, 0.2, 0.6) * pow(n2, 1.5) * 1.0;
    float3 layer3 = float3(0.3, 0.05, 0.5) * pow(n3, 2.0) * 0.8;

    col += layer1 + layer2 + layer3;

    float dust = nebFbmMtl(uv * 6.0 + t * 0.2);
    col *= 0.7 + 0.3 * dust;

    float emission = pow(nebFbmMtl(uv * 5.0 + t * 0.5), 3.0);
    col += float3(1.0, 0.4, 0.2) * emission * 0.4;

    for (int i = 0; i < 50; i++) {
        float fi = float(i);
        float2 starPos = float2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) - 0.5) * 1.2;
        float d = length(uv - starPos);
        float star = exp(-d * d * 5000.0);
        float twinkle = 0.6 + 0.4 * sin(iTime * 3.0 + fi * 7.0);
        col += star * twinkle * float3(1.0, 0.95, 0.9);
    }

    return float4(col, 1.0);
}
