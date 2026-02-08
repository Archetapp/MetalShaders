#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float ffHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float ffNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = ffHash(i);
    float b = ffHash(i + float2(1.0, 0.0));
    float c = ffHash(i + float2(0.0, 1.0));
    float d = ffHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float ffFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * ffNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 ferrofluidFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

    float2 magnetPos = float2(cos(iTime * 0.7) * 0.35, sin(iTime * 0.9) * 0.35);
    float2 toMagnet = magnetPos - uv;
    float distToMagnet = length(toMagnet);
    float2 magnetDir = normalize(toMagnet);

    float baseSurface = length(uv) - 0.35;

    float spikeFreq = 12.0;
    float angle = atan2(uv.y, uv.x);
    float spikePattern = sin(angle * spikeFreq + iTime * 2.0) * 0.5 + 0.5;
    spikePattern *= sin(angle * spikeFreq * 1.618 - iTime * 1.5) * 0.5 + 0.5;

    float magnetInfluence = exp(-distToMagnet * 3.0);
    float magnetAngle = atan2(magnetDir.y, magnetDir.x);
    float directionalSpikes = pow(max(0.0, cos(angle - magnetAngle)), 2.0);

    float spikeHeight = 0.08 * spikePattern + 0.15 * magnetInfluence * directionalSpikes;
    spikeHeight += 0.03 * sin(angle * 24.0 + iTime * 3.0) * magnetInfluence;

    float noiseDetail = ffFbm(uv * 8.0 + iTime * 0.3) * 0.04;
    float surface = baseSurface - spikeHeight - noiseDetail;

    float2 eps = float2(0.002, 0.0);
    float nx = length(uv + eps.xy) - 0.35 - length(uv - eps.xy) + 0.35;
    float ny = length(uv + eps.yx) - 0.35 - length(uv - eps.yx) + 0.35;
    float3 normal = normalize(float3(nx, ny, 0.15));

    float3 lightDir1 = normalize(float3(magnetPos - uv, 0.8));
    float3 lightDir2 = normalize(float3(0.5, 0.8, 0.6));
    float3 viewDir = float3(0.0, 0.0, 1.0);

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    float3 halfDir1 = normalize(lightDir1 + viewDir);
    float3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 64.0);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 32.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    float3 baseColor = float3(0.02, 0.02, 0.03);
    float3 specColor = float3(0.7, 0.75, 0.8);
    float3 rimColor = float3(0.15, 0.18, 0.25);

    float3 col = baseColor;
    col += diff1 * 0.15 * float3(0.4, 0.45, 0.5);
    col += diff2 * 0.1 * float3(0.3, 0.3, 0.35);
    col += spec1 * specColor * 0.8;
    col += spec2 * specColor * 0.4;
    col += fresnel * rimColor;

    float edgeGlow = smoothstep(0.01, -0.01, surface);
    col *= edgeGlow;

    float magnetGlow = exp(-distToMagnet * 5.0) * 0.08;
    col += float3(0.3, 0.35, 0.5) * magnetGlow * edgeGlow;

    float3 bg = float3(0.01, 0.01, 0.015);
    bg += 0.02 * ffFbm(uv * 3.0 + iTime * 0.1);
    col = mix(bg, col, edgeGlow);

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
