#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float cometNoiseMtl(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 cometTailFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.02);

    float2 cometPos = float2(-0.1 + sin(iTime * 0.3) * 0.05, 0.05);
    float2 toComet = uv - cometPos;
    float r = length(toComet);

    float nucleus = exp(-r * r * 800.0);
    col += float3(1.0, 0.95, 0.8) * nucleus;

    float coma = exp(-r * 15.0);
    col += float3(0.4, 0.6, 0.8) * coma * 0.5;

    float tailAngle = 0.3;
    float2 tailDir = normalize(float2(cos(tailAngle), sin(tailAngle)));
    float along = dot(toComet, tailDir);
    float perp = abs(dot(toComet, float2(-tailDir.y, tailDir.x)));
    float tailWidth = 0.02 + along * 0.15;
    float dustTail = exp(-perp / tailWidth) * smoothstep(0.0, 0.05, along) * exp(-along * 2.0);

    float tailNoise = cometNoiseMtl(float2(along * 20.0 - iTime * 2.0, perp * 30.0));
    dustTail *= 0.7 + 0.3 * tailNoise;
    col += float3(0.8, 0.7, 0.4) * dustTail * 0.6;

    float2 ionDir = normalize(float2(cos(tailAngle - 0.15), sin(tailAngle - 0.15)));
    float ionAlong = dot(toComet, ionDir);
    float ionPerp = abs(dot(toComet, float2(-ionDir.y, ionDir.x)));
    float ionWidth = 0.008 + ionAlong * 0.05;
    float ionTail = exp(-ionPerp / ionWidth) * smoothstep(0.0, 0.03, ionAlong) * exp(-ionAlong * 1.5);
    col += float3(0.2, 0.4, 1.0) * ionTail * 0.4;

    for (int i = 0; i < 40; i++) {
        float fi = float(i);
        float2 starPos = float2(cometNoiseMtl(float2(fi, 0.0)) - 0.5, cometNoiseMtl(float2(0.0, fi)) - 0.5);
        float d = length(uv - starPos);
        col += exp(-d * d * 4000.0) * float3(0.7, 0.75, 0.9) * 0.5;
    }

    return float4(col, 1.0);
}
