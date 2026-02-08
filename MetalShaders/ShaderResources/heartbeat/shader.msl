#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float heartSDFMtl(float2 p) {
    p.y -= 0.05;
    p.x = abs(p.x);
    float a = atan2(p.y, p.x) / M_PI_F;
    float r = length(p);
    float h = abs(a);
    float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
    return r - d * 0.15;
}

float ecgWaveMtl(float x) {
    float t = fmod(x, 1.0);
    float y = 0.0;
    y += 0.05 * exp(-pow((t - 0.1) * 20.0, 2.0));
    y -= 0.03 * exp(-pow((t - 0.2) * 30.0, 2.0));
    y += 0.3 * exp(-pow((t - 0.25) * 40.0, 2.0));
    y -= 0.08 * exp(-pow((t - 0.3) * 30.0, 2.0));
    y += 0.07 * exp(-pow((t - 0.55) * 15.0, 2.0));
    return y;
}

fragment float4 heartbeatFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.02, 0.02, 0.04);

    float pulse = sin(iTime * 4.0) * 0.5 + 0.5;
    pulse = pow(pulse, 4.0);
    float scale = 1.0 + pulse * 0.15;

    float heart = heartSDFMtl(uv * scale);
    float heartMask = smoothstep(0.01, -0.01, heart);
    float heartEdge = smoothstep(0.02, 0.0, abs(heart));

    float3 heartCol = mix(float3(0.7, 0.05, 0.1), float3(1.0, 0.2, 0.2), pulse);
    col = mix(col, heartCol, heartMask);
    col += float3(1.0, 0.3, 0.3) * heartEdge * 0.5;

    float glow = exp(-heart * 8.0) * pulse * 0.4;
    col += float3(0.8, 0.1, 0.15) * glow;

    float ecgY = ecgWaveMtl(uv.x * 1.5 + iTime * 0.8) * 0.5;
    float ecgLine = smoothstep(0.005, 0.001, abs(uv.y + 0.3 - ecgY));
    float ecgTrail = smoothstep(0.0, -0.3, uv.x - fmod(-iTime * 0.53, 1.0) + 0.17);
    col += float3(0.0, 1.0, 0.3) * ecgLine * ecgTrail;
    col += float3(0.0, 0.2, 0.05) * exp(-abs(uv.y + 0.3 - ecgY) * 30.0) * ecgTrail;

    return float4(col, 1.0);
}
