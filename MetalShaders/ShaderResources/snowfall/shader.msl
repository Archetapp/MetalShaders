#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float snowfallHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float snowfallNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = snowfallHash(i);
    float b = snowfallHash(i + float2(1.0, 0.0));
    float c = snowfallHash(i + float2(0.0, 1.0));
    float d = snowfallHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float snowfallFlake(float2 uv, float2 pos, float sz) {
    float d = length(uv - pos);
    float core = smoothstep(sz, sz * 0.2, d);
    float angle = atan2(uv.y - pos.y, uv.x - pos.x);
    float arms = abs(sin(angle * 3.0));
    float armShape = smoothstep(sz * 2.0, sz * 0.5, d) * smoothstep(0.3, 0.7, arms);
    return core + armShape * 0.3;
}

float snowfallLayer(float2 uv, float depth, float time) {
    float result = 0.0;
    float gridSize = 4.0 + depth * 3.0;
    float fallSpeed = 0.15 + depth * 0.05;
    float windStrength = 0.3 + depth * 0.1;

    float wind = sin(time * 0.3 + depth) * windStrength;
    uv.x += wind * time * 0.1;
    uv.y += time * fallSpeed;

    float2 grid = floor(uv * gridSize);
    float2 gridUv = fract(uv * gridSize);

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            float2 neighbor = float2(float(x), float(y));
            float2 cell = grid + neighbor;
            float h = snowfallHash(cell + depth * 100.0);

            if (h > 0.4) continue;

            float2 offset = float2(snowfallHash(cell * 1.7 + depth * 50.0),
                                   snowfallHash(cell * 2.3 + depth * 70.0));

            float wobbleX = sin(time * (0.5 + h) + h * 6.28) * 0.15;
            float wobbleY = sin(time * (0.3 + h * 0.5) + h * 3.14) * 0.05;

            float2 pos = neighbor + offset + float2(wobbleX, wobbleY);
            float sz = 0.02 + h * 0.04;
            sz *= (0.5 + depth * 0.5);

            result += snowfallFlake(gridUv, pos, sz) * (0.3 + h * 0.7);
        }
    }

    return result;
}

fragment float4 snowfallFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;

    float3 skyTop = float3(0.05, 0.07, 0.15);
    float3 skyBottom = float3(0.15, 0.18, 0.28);
    float3 col = mix(skyBottom, skyTop, uv.y / aspect);

    float atmosphericGlow = exp(-length(float2(uv.x / aspect - 0.5, uv.y / aspect - 0.3)) * 3.0) * 0.15;
    col += float3(0.2, 0.25, 0.4) * atmosphericGlow;

    float groundY = 0.08;
    float groundMask = smoothstep(groundY + 0.02, groundY - 0.01, uv.y / aspect);
    float3 groundColor = float3(0.6, 0.65, 0.75) * (0.3 + snowfallNoise(uv * 20.0) * 0.1);
    col = mix(col, groundColor, groundMask);

    for (int i = 0; i < 6; i++) {
        float depth = float(i) / 5.0;
        float layerIntensity = snowfallLayer(uv, depth, iTime);
        float brightness = 0.4 + depth * 0.6;
        float opacity = (0.3 + depth * 0.7);

        float3 snowColor = mix(float3(0.6, 0.7, 0.85), float3(1.0, 1.0, 1.0), depth);
        col += snowColor * layerIntensity * brightness * opacity;
    }

    float fog = (1.0 - uv.y / aspect) * 0.15;
    col = mix(col, float3(0.3, 0.35, 0.45), fog);

    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
