#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float pdHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float pdHash2(float p) {
    return fract(sin(p * 127.1) * 43758.5453);
}

float pdNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = pdHash(i);
    float b = pdHash(i + float2(1.0, 0.0));
    float c = pdHash(i + float2(0.0, 1.0));
    float d = pdHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float pdDripLine(float2 uv, float seed, float t) {
    float startX = pdHash2(seed * 13.37) * 2.0 - 1.0;
    float startY = pdHash2(seed * 7.13) * 2.0 - 1.0;
    float speed = 0.3 + pdHash2(seed * 3.71) * 0.5;
    float amplitude = 0.1 + pdHash2(seed * 11.3) * 0.4;
    float freq = 2.0 + pdHash2(seed * 5.17) * 4.0;
    float width = 0.003 + pdHash2(seed * 9.31) * 0.008;

    float animT = t * speed;
    float paramRange = 3.0;

    float minDist = 1e5;

    for (int i = 0; i < 60; i++) {
        float param = float(i) / 60.0 * paramRange;
        if (param > animT) break;

        float px = startX + param * 0.6 * sin(seed * 2.0) +
                   amplitude * sin(param * freq + seed) +
                   0.05 * sin(param * freq * 3.0 + seed * 7.0);
        float py = startY + param * 0.5 * cos(seed * 3.0) +
                   amplitude * 0.7 * cos(param * freq * 0.7 + seed * 1.5);

        float gravity = param * param * 0.02 * pdHash2(seed * 17.0);
        py -= gravity;

        float d = length(uv - float2(px, py));

        float localWidth = width * (1.0 + 0.5 * sin(param * 10.0));
        localWidth *= smoothstep(animT, animT - 0.3, param);

        minDist = min(minDist, d - localWidth);
    }

    return minDist;
}

float pdSplatter(float2 uv, float seed, float t) {
    float cx = pdHash2(seed * 23.7) * 1.6 - 0.8;
    float cy = pdHash2(seed * 31.3) * 1.0 - 0.5;
    float appearTime = pdHash2(seed * 41.1) * 8.0;

    if (t < appearTime) return 1e5;

    float grow = smoothstep(appearTime, appearTime + 0.3, t);
    float radius = (0.01 + pdHash2(seed * 51.7) * 0.03) * grow;

    float d = length(uv - float2(cx, cy)) - radius;

    for (int i = 0; i < 5; i++) {
        float angle = pdHash2(seed * float(i + 1) * 7.0) * 6.28318;
        float splashDist = radius + pdHash2(seed * float(i + 1) * 13.0) * 0.04;
        float2 splashPos = float2(cx, cy) + float2(cos(angle), sin(angle)) * splashDist;
        float splashR = 0.003 + pdHash2(seed * float(i + 1) * 19.0) * 0.008;
        d = min(d, length(uv - splashPos) - splashR * grow);
    }

    return d;
}

fragment float4 pollockDripFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float t = iTime * 0.5;

    float3 canvas = float3(0.92, 0.9, 0.85);
    float canvasNoise = pdNoise(uv * 50.0) * 0.03;
    canvas -= canvasNoise;

    float3 col = canvas;

    constant float3 colors[] = {
        float3(0.1, 0.1, 0.1),
        float3(0.7, 0.15, 0.1),
        float3(0.15, 0.2, 0.6),
        float3(0.9, 0.8, 0.2),
        float3(0.9, 0.9, 0.88)
    };

    for (int layer = 0; layer < 15; layer++) {
        float seed = float(layer) + 1.0;
        float layerT = t - float(layer) * 0.3;
        if (layerT < 0.0) continue;

        float d = pdDripLine(uv, seed, layerT);

        int colorIdx = layer % 5;
        float3 paintColor = colors[colorIdx];

        float texNoise = pdNoise(uv * 200.0 + seed * 10.0) * 0.1;
        paintColor += texNoise;

        float paint = smoothstep(0.002, -0.002, d);
        float edge = smoothstep(0.005, 0.0, abs(d)) * 0.3;

        col = mix(col, paintColor, paint * 0.9);
        col = mix(col, paintColor * 0.7, edge);
    }

    for (int s = 0; s < 20; s++) {
        float seed = float(s) + 100.0;
        float d = pdSplatter(uv, seed, t);

        int colorIdx = s % 5;
        float3 paintColor = colors[colorIdx];

        float paint = smoothstep(0.002, -0.002, d);
        col = mix(col, paintColor, paint * 0.85);
    }

    col *= 1.0 - 0.15 * length(uv);

    return float4(col, 1.0);
}
