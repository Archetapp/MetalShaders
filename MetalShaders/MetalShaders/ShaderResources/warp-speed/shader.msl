#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float warpHashMtl(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 warpSpeedFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0, 0.0, 0.02);

    float warpFactor = 0.5 + 0.5 * sin(iTime * 0.5);
    float streakLen = 0.01 + warpFactor * 0.15;

    for (int i = 0; i < 120; i++) {
        float fi = float(i);
        float angle = warpHashMtl(fi * 73.1) * 2.0 * M_PI_F;
        float baseR = warpHashMtl(fi * 31.7) * 0.5 + 0.02;
        float speed = 0.2 + warpHashMtl(fi * 17.3) * 0.8;
        float depth = fract(baseR - iTime * speed * 0.3);

        float2 starDir = float2(cos(angle), sin(angle));
        float2 starPos = starDir * depth;

        float2 toStar = uv - starPos;
        float along = dot(toStar, starDir);
        float perp = abs(dot(toStar, float2(-starDir.y, starDir.x)));

        float sLen = streakLen * (1.0 - depth) * speed;
        float streak = exp(-perp * perp * 40000.0) *
                       smoothstep(sLen, 0.0, along) * smoothstep(-0.005, 0.0, along);
        float head = exp(-dot(toStar, toStar) * 8000.0);

        float brightness = (1.0 - depth) * (0.5 + warpFactor * 0.5);
        float3 starCol = mix(float3(0.5, 0.6, 1.0), float3(1.0, 0.9, 0.8), warpHashMtl(fi * 41.3));
        col += (head * 1.5 + streak) * starCol * brightness;
    }

    float tunnel = exp(-length(uv) * 2.0 * (1.0 - warpFactor * 0.8));
    col += float3(0.05, 0.08, 0.2) * tunnel * warpFactor;

    float flash = pow(warpFactor, 8.0) * exp(-length(uv) * 5.0);
    col += float3(0.5, 0.6, 1.0) * flash;

    return float4(col, 1.0);
}
