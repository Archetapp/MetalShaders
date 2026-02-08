#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float snNoiseMtl(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 supernovaFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.015);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);
    float t = fmod(iTime * 0.3, 4.0);

    float shellR = t * 0.15;
    float shellWidth = 0.03 + t * 0.02;
    float shell = exp(-pow((r - shellR) / shellWidth, 2.0));

    float filaments = snNoiseMtl(float2(a * 5.0, r * 10.0 - iTime)) * 0.5 + 0.5;
    shell *= 0.7 + 0.3 * filaments;

    float3 shellCol = mix(float3(1.0, 0.8, 0.3), float3(1.0, 0.3, 0.1), t / 4.0);
    shellCol = mix(shellCol, float3(0.3, 0.5, 1.0), smoothstep(0.3, 0.6, r));
    col += shell * shellCol * (1.0 - t / 5.0);

    float innerGlow = exp(-r * r * 50.0) * (1.0 - t / 4.0);
    col += float3(1.0, 0.95, 0.8) * innerGlow;

    float remnant = exp(-r * r * 200.0);
    float pulse = 0.5 + 0.5 * sin(iTime * 5.0);
    col += float3(0.5, 0.6, 1.0) * remnant * (0.5 + pulse * 0.5) * smoothstep(1.0, 2.0, t);

    for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float debrisAngle = snNoiseMtl(float2(fi, 0.0)) * 2.0 * M_PI_F;
        float debrisSpeed = 0.05 + snNoiseMtl(float2(0.0, fi)) * 0.1;
        float2 debrisPos = float2(cos(debrisAngle), sin(debrisAngle)) * debrisSpeed * t;
        float d = length(uv - debrisPos);
        float debris = exp(-d * d * 2000.0);
        col += debris * float3(1.0, 0.6, 0.2) * (1.0 - t / 4.0);
    }

    float shockwave = smoothstep(0.02, 0.0, abs(r - shellR * 1.3)) * (1.0 - t / 4.0);
    col += float3(0.3, 0.4, 1.0) * shockwave * 0.5;

    return float4(col, 1.0);
}
