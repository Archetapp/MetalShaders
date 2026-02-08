#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float rgN21(float2 p) {
    p = fract(p * float2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

float3 rgBackground(float2 uv, float iTime) {
    float t = iTime * 0.1;
    float3 top = float3(0.1, 0.15, 0.3);
    float3 bot = float3(0.3, 0.25, 0.15);
    float3 col = mix(bot, top, uv.y * 0.5 + 0.5);

    float lights = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
        float2 lp = float2(
            sin(i * 1.5 + t) * 0.3 + 0.5,
            cos(i * 2.3 + t * 0.7) * 0.2 + 0.5
        );
        float d = length(uv - lp);
        float3 lc = 0.5 + 0.5 * cos(float3(0.0, 2.0, 4.0) + i * 0.8);
        lights += 0.01 / (d * d + 0.01);
        col += lc * 0.003 / (d * d + 0.01);
    }
    col = mix(col, col * 1.2, lights * 0.05);
    return col * 0.6;
}

float2 rgDropLayer(float2 uv, float t, float size) {
    float2 aspect = float2(2.0, 1.0);
    float2 uvScaled = uv * size * aspect;

    uvScaled.y += t * 0.75;
    float2 gv = fract(uvScaled) - 0.5;
    float2 id = floor(uvScaled);

    float n = rgN21(id);
    t += n * 6.28;

    float w = uv.y * 10.0;
    float x = (n - 0.5) * 0.8;
    x += (0.4 - abs(x)) * sin(3.0 * w) * pow(sin(w), 6.0) * 0.45;
    float y = -sin(t + sin(t + sin(t) * 0.5)) * 0.45;
    y -= (gv.x - x) * (gv.x - x);

    float2 dropPos = (gv - float2(x, y)) / aspect;
    float drop = smoothstep(0.05, 0.03, length(dropPos));

    float2 trailPos = (gv - float2(x, t * 0.25)) / aspect;
    trailPos.y = (fract(trailPos.y * 8.0) - 0.5) / 8.0;
    float trail = smoothstep(0.03, 0.01, length(trailPos));
    float fogTrail = smoothstep(-0.05, 0.05, dropPos.y);
    fogTrail *= smoothstep(0.5, y, gv.y);
    trail *= fogTrail;
    fogTrail *= smoothstep(0.05, 0.04, abs(dropPos.x));

    float2 offs = drop * dropPos * 30.0 + trail * trailPos * 30.0;
    return offs;
}

fragment float4 rainOnGlassFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = fragCoord / iResolution;
    float2 uvCentered = (fragCoord - 0.5 * iResolution) / iResolution.y;

    float t = iTime;

    float2 offs = float2(0.0);
    offs += rgDropLayer(uvCentered, t, 40.0);
    offs += rgDropLayer(uvCentered * 1.23 + 3.12, t * 0.8, 25.0);
    offs += rgDropLayer(uvCentered * 0.9 + 7.51, t * 1.2, 60.0) * 0.5;

    float2 distortedUV = uv + offs * 0.01;
    float3 col = rgBackground(distortedUV, iTime);

    float fog = smoothstep(0.0, 0.5, length(offs));
    col = mix(col, col * 0.7 + 0.1, 0.3 - fog * 0.2);

    float vig = 1.0 - 0.3 * dot(uvCentered, uvCentered);
    col *= vig;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
