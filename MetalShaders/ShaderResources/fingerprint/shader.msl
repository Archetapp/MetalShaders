#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float fpNoiseMtl(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, float2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + float2(1.0, 0.0), float2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + float2(0.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + float2(1.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

fragment float4 fingerprintFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.92, 0.85, 0.75);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float whorlCenter = r * 15.0 + a * 1.5;
    float distortion = fpNoiseMtl(uv * 3.0 + iTime * 0.05) * 2.0;
    float ridgePattern = sin(whorlCenter + distortion + sin(uv.y * 20.0 + distortion) * 1.5);

    float ridge = smoothstep(0.0, 0.3, ridgePattern) - smoothstep(0.3, 0.6, ridgePattern);
    ridge *= 0.6;

    float fingerMask = smoothstep(0.4, 0.35, r);
    fingerMask *= smoothstep(-0.5, -0.3, uv.y);

    float3 ridgeCol = float3(0.55, 0.4, 0.35);
    float3 valleyCol = float3(0.85, 0.75, 0.65);
    col = mix(valleyCol, ridgeCol, ridge * fingerMask);

    float scan = smoothstep(0.005, 0.0, abs(uv.y - fmod(iTime * 0.3, 1.0) + 0.5));
    col += float3(0.0, 0.3, 0.0) * scan * fingerMask * 0.5;

    col = mix(float3(0.92, 0.85, 0.75), col, fingerMask);

    return float4(col, 1.0);
}
