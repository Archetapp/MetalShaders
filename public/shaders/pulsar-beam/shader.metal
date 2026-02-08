#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 pulsarBeamFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.015);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);

    float starSize = 0.02;
    float star = smoothstep(starSize, starSize * 0.3, r);
    col += float3(0.7, 0.8, 1.0) * star;

    float pulsarGlow = exp(-r * 20.0);
    col += float3(0.3, 0.4, 0.8) * pulsarGlow;

    float beamAngle = iTime * 4.0;
    float beam1Angle = a - beamAngle;
    float beam2Angle = a - beamAngle - M_PI_F;

    float beamWidth = 0.08;
    float b1a = fmod(beam1Angle + M_PI_F, 2.0 * M_PI_F) - M_PI_F;
    float b2a = fmod(beam2Angle + M_PI_F, 2.0 * M_PI_F) - M_PI_F;
    float beam1 = exp(-(b1a * b1a) / (beamWidth * beamWidth));
    float beam2 = exp(-(b2a * b2a) / (beamWidth * beamWidth));

    float beamFade = exp(-r * 1.5) * step(0.02, r);
    float3 beamCol = mix(float3(0.3, 0.5, 1.0), float3(0.6, 0.8, 1.0), r * 2.0);
    col += (beam1 + beam2) * beamCol * beamFade;

    float rings = sin(r * 60.0 - iTime * 3.0) * 0.5 + 0.5;
    rings *= exp(-r * 8.0);
    col += float3(0.2, 0.3, 0.5) * rings * 0.2;

    float magneticField = exp(-abs(uv.y) * 10.0) * exp(-r * 3.0);
    col += float3(0.1, 0.15, 0.3) * magneticField * 0.3;

    for (int i = 0; i < 50; i++) {
        float fi = float(i);
        float2 sp = float2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) - 0.5);
        float d = length(uv - sp);
        col += exp(-d * d * 5000.0) * float3(0.6, 0.65, 0.8) * 0.4;
    }

    return float4(col, 1.0);
}
