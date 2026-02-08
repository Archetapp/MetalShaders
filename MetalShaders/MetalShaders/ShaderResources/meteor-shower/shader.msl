#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float meteorHashMtl(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 meteorShowerFragment(VertexOut in [[stage_in]],
                                      constant float &iTime [[buffer(0)]],
                                      constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.005, 0.005, 0.02);

    for (int i = 0; i < 80; i++) {
        float fi = float(i);
        float2 sp = float2(meteorHashMtl(fi * 73.1) - 0.5, meteorHashMtl(fi * 91.3) - 0.5);
        float d = length(uv - sp);
        float twinkle = 0.6 + 0.4 * sin(iTime * (1.0 + meteorHashMtl(fi * 11.0)) + fi * 7.0);
        col += exp(-d * d * 8000.0) * float3(0.6, 0.65, 0.8) * 0.3 * twinkle;
    }

    for (int i = 0; i < 15; i++) {
        float fi = float(i);
        float birth = meteorHashMtl(fi * 17.31) * 5.0;
        float t = fmod(iTime - birth, 5.0);
        float life = smoothstep(0.0, 0.1, t) * smoothstep(1.5, 0.5, t);

        float startX = meteorHashMtl(fi * 23.17) * 0.8 - 0.4;
        float startY = 0.3 + meteorHashMtl(fi * 31.71) * 0.2;
        float angle = -0.7 - meteorHashMtl(fi * 7.13) * 0.3;
        float speed = 0.3 + meteorHashMtl(fi * 11.37) * 0.3;

        float2 pos = float2(startX, startY) + float2(cos(angle), sin(angle)) * speed * t;
        float2 dir = normalize(float2(cos(angle), sin(angle)));

        float2 toPoint = uv - pos;
        float along = dot(toPoint, dir);
        float perp = abs(dot(toPoint, float2(-dir.y, dir.x)));

        float tailLen = 0.15 * life;
        float tail = exp(-perp * 400.0) * smoothstep(0.0, -tailLen, along) * smoothstep(-tailLen * 1.5, -tailLen * 0.5, along);
        float head = exp(-dot(toPoint, toPoint) * 3000.0);

        float3 meteorCol = mix(float3(1.0, 0.8, 0.4), float3(1.0, 0.5, 0.2), -along / tailLen);
        col += (head * 2.0 + tail) * meteorCol * life;

        for (int j = 0; j < 3; j++) {
            float fj = float(j);
            float2 sparkPos = pos + dir * (-0.02 - fj * 0.03) + float2(meteorHashMtl(fi * 100.0 + fj) - 0.5, meteorHashMtl(fi * 200.0 + fj) - 0.5) * 0.02;
            float sparkD = length(uv - sparkPos);
            col += exp(-sparkD * sparkD * 5000.0) * float3(1.0, 0.6, 0.2) * life * 0.3;
        }
    }

    return float4(col, 1.0);
}
