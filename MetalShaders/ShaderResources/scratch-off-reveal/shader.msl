#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float scratchRevealHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float scratchRevealNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = scratchRevealHash(i);
    float b = scratchRevealHash(i + float2(1.0, 0.0));
    float c = scratchRevealHash(i + float2(0.0, 1.0));
    float d = scratchRevealHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float scratchRevealFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * scratchRevealNoise(p);
        p = p * 2.0 + float2(100.0);
        a *= 0.5;
    }
    return v;
}

float scratchRevealPath(float2 uv, float2 start, float2 end, float width) {
    float2 pa = uv - start;
    float2 ba = end - start;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    float noiseWidth = width * (0.7 + scratchRevealNoise(uv * 20.0) * 0.6);
    return smoothstep(noiseWidth, noiseWidth * 0.3, d);
}

float3 scratchRevealContent(float2 uv) {
    float3 col1 = float3(0.9, 0.2, 0.3);
    float3 col2 = float3(0.2, 0.7, 0.9);
    float3 col3 = float3(0.95, 0.8, 0.2);
    float3 col4 = float3(0.3, 0.9, 0.4);

    float angle = atan2(uv.y - 0.5, uv.x - 0.5);
    float dist = length(uv - 0.5);

    float pattern = sin(angle * 3.0 + dist * 10.0) * 0.5 + 0.5;
    float pattern2 = sin(uv.x * 15.0) * sin(uv.y * 15.0) * 0.5 + 0.5;

    float3 col = mix(col1, col2, pattern);
    col = mix(col, col3, pattern2 * 0.5);

    float star = pow(max(sin(angle * 5.0) * sin(dist * 20.0), 0.0), 2.0);
    col += col4 * star * 0.5;

    float sparkle = pow(scratchRevealHash(floor(uv * 30.0)), 15.0) * 2.0;
    col += float3(1.0, 0.9, 0.5) * sparkle;

    return col;
}

fragment float4 scratchOffRevealFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;

    float cycleTime = 12.0;
    float t = fmod(iTime, cycleTime);

    float scratchMask = 0.0;
    float scratchWidth = 0.04;

    for (int i = 0; i < 15; i++) {
        float pathTime = float(i) * cycleTime / 15.0;
        if (t < pathTime) continue;

        float pathProgress = clamp((t - pathTime) / 1.5, 0.0, 1.0);

        float id = float(i);
        float2 start = float2(
            scratchRevealHash(float2(id * 1.3, 0.0)),
            scratchRevealHash(float2(id * 2.7, 1.0))
        );

        float angle = scratchRevealHash(float2(id * 3.1, 2.0)) * 6.28;
        float pathLen = 0.2 + scratchRevealHash(float2(id * 4.3, 3.0)) * 0.4;
        float2 end = start + float2(cos(angle), sin(angle)) * pathLen;

        float2 currentEnd = mix(start, end, pathProgress);
        float width = scratchWidth * (0.5 + scratchRevealHash(float2(id * 5.7, 4.0)) * 1.0);

        scratchMask += scratchRevealPath(uv, start, currentEnd, width);

        if (pathProgress > 0.3) {
            float subAngle = angle + (scratchRevealHash(float2(id, 5.0)) - 0.5) * 1.5;
            float2 branchStart = mix(start, end, 0.3 + scratchRevealHash(float2(id, 6.0)) * 0.4);
            float2 branchEnd = branchStart + float2(cos(subAngle), sin(subAngle)) * pathLen * 0.5;
            float2 currentBranchEnd = mix(branchStart, branchEnd, clamp((pathProgress - 0.3) / 0.7, 0.0, 1.0));
            scratchMask += scratchRevealPath(uv, branchStart, currentBranchEnd, width * 0.6);
        }
    }

    scratchMask = clamp(scratchMask, 0.0, 1.0);

    float edgeNoise = scratchRevealFbm(uv * 15.0) * 0.3;
    scratchMask = smoothstep(0.2 - edgeNoise, 0.5 + edgeNoise, scratchMask);

    float3 reveal = scratchRevealContent(uv);

    float3 metalBase = float3(0.75, 0.75, 0.78);
    float metalNoise = scratchRevealFbm(uv * 8.0);
    metalBase += float3(metalNoise * 0.1 - 0.05);

    float brushAngle = uv.x * 40.0 + uv.y * 5.0;
    float brushMark = sin(brushAngle) * 0.02;
    metalBase += float3(brushMark);

    float viewAngle = sin(iTime * 0.5) * 0.3;
    float specHighlight = pow(max(sin(uv.x * 10.0 + viewAngle * 5.0) * cos(uv.y * 8.0 + viewAngle * 3.0), 0.0), 8.0);
    metalBase += float3(0.3) * specHighlight;

    float scratchEdge = smoothstep(0.4, 0.5, scratchMask) - smoothstep(0.5, 0.6, scratchMask);
    float3 edgeHighlight = float3(0.9, 0.9, 0.95) * scratchEdge;

    float3 col = mix(metalBase + edgeHighlight, reveal, scratchMask);

    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    col *= smoothstep(0.0, 0.8, vignette);

    return float4(col, 1.0);
}
