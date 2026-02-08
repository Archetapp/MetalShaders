#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float galaxyNoiseMtl(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = dot(i, float2(127.1, 311.7));
    return mix(mix(fract(sin(n) * 43758.5453), fract(sin(n + 127.1) * 43758.5453), f.x),
               mix(fract(sin(n + 311.7) * 43758.5453), fract(sin(n + 438.8) * 43758.5453), f.x), f.y);
}

float galaxyFbmMtl(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * galaxyNoiseMtl(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 galaxySpiralDeepFragment(VertexOut in [[stage_in]],
                                          constant float &iTime [[buffer(0)]],
                                          constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.015);

    float r = length(uv);
    float a = atan2(uv.y, uv.x) + iTime * 0.1;

    float arms = 2.0;
    float twist = 3.0;
    float spiral = sin(a * arms - r * twist * 2.0 * M_PI_F + galaxyFbmMtl(uv * 3.0) * 2.0);
    spiral = pow(max(spiral, 0.0), 2.0);

    float diskMask = exp(-r * 3.0);
    float armBrightness = spiral * diskMask;

    float3 armCol = mix(float3(0.3, 0.4, 0.8), float3(0.8, 0.6, 0.9), r * 2.0);
    col += armCol * armBrightness * 0.6;

    float dust = galaxyFbmMtl(uv * 8.0 + iTime * 0.05);
    col *= 1.0 - dust * 0.3 * diskMask;

    float core = exp(-r * r * 80.0);
    col += float3(1.0, 0.9, 0.7) * core;
    col += float3(0.8, 0.7, 0.5) * exp(-r * r * 20.0) * 0.5;

    for (int i = 0; i < 80; i++) {
        float fi = float(i);
        float starAngle = fract(sin(fi * 73.13) * 43758.5453) * 2.0 * M_PI_F;
        float starR = fract(sin(fi * 31.71) * 43758.5453) * 0.45;
        float2 starPos = float2(cos(starAngle), sin(starAngle)) * starR;
        float starD = length(uv - starPos);
        float star = exp(-starD * starD * 8000.0);
        float twinkle = 0.7 + 0.3 * sin(iTime * 2.0 + fi * 5.0);
        col += star * float3(0.8, 0.85, 1.0) * twinkle;
    }

    return float4(col, 1.0);
}
