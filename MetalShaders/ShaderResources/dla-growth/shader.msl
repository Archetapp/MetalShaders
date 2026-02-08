#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float dlaHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float dlaNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = dlaHash(i);
    float b = dlaHash(i + float2(1, 0));
    float c = dlaHash(i + float2(0, 1));
    float d = dlaHash(i + float2(1, 1));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float dlaFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
        v += a * dlaNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float dlaBranch(float2 p, float angle, float width, float growthT) {
    float2 dir = float2(cos(angle), sin(angle));
    float proj = dot(p, dir);
    float perp = abs(dot(p, float2(-dir.y, dir.x)));

    float len = growthT;
    float taperedWidth = width * (1.0 - proj / max(len, 0.01) * 0.7);

    if (proj < 0.0 || proj > len) return 1e5;
    return perp - taperedWidth;
}

float dlaCrystal(float2 uv, float growth) {
    float d = 1e5;
    int numSymmetry = 6;

    for (int s = 0; s < 6; s++) {
        float symAngle = float(s) * 6.28318 / float(numSymmetry);
        float cs = cos(symAngle), sn = sin(symAngle);
        float2 p = float2(uv.x * cs + uv.y * sn, -uv.x * sn + uv.y * cs);

        float mainBranch = dlaBranch(p, 0.0, 0.012, growth * 0.45);
        d = min(d, mainBranch);

        for (int b = 1; b <= 5; b++) {
            float branchStart = float(b) * 0.08;
            if (branchStart > growth * 0.45) continue;

            float2 bp = p - float2(branchStart, 0.0);
            float subGrowth = (growth * 0.45 - branchStart) * 1.5;

            float upperBranch = dlaBranch(bp, 1.047, 0.008, subGrowth * 0.6);
            float lowerBranch = dlaBranch(bp, -1.047, 0.008, subGrowth * 0.6);
            d = min(d, upperBranch);
            d = min(d, lowerBranch);

            if (subGrowth > 0.05) {
                for (int sb = 1; sb <= 2; sb++) {
                    float subStart = float(sb) * 0.04;
                    if (subStart > subGrowth * 0.6) continue;

                    float2 ubp = bp + float2(cos(1.047), sin(1.047)) * subStart;
                    float tinyGrowth = (subGrowth * 0.6 - subStart) * 1.2;
                    float tinyBranch = dlaBranch(ubp, 0.524, 0.005, tinyGrowth * 0.4);
                    d = min(d, tinyBranch);

                    float2 lbp = bp + float2(cos(-1.047), sin(-1.047)) * subStart;
                    float tinyBranch2 = dlaBranch(lbp, -0.524, 0.005, tinyGrowth * 0.4);
                    d = min(d, tinyBranch2);
                }
            }
        }
    }

    float center = length(uv) - 0.015;
    d = min(d, center);

    return d;
}

fragment float4 dlaGrowthFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float growth = clamp(iTime * 0.12, 0.0, 1.0);
    float pulseGrowth = growth + 0.02 * sin(iTime * 2.0) * growth;

    float d = dlaCrystal(uv, pulseGrowth);

    float3 bgColor = float3(0.01, 0.02, 0.08);
    float bgNoise = dlaFbm(uv * 5.0 + iTime * 0.05) * 0.03;
    bgColor += bgNoise;

    float crystal = smoothstep(0.003, -0.003, d);
    float edge = smoothstep(0.008, 0.001, abs(d));

    float3 crystalColor = float3(0.85, 0.92, 1.0);
    float3 edgeColor = float3(0.5, 0.7, 1.0);
    float3 coreColor = float3(1.0, 1.0, 1.0);

    float centerDist = length(uv);
    float3 bodyColor = mix(coreColor, crystalColor, smoothstep(0.0, 0.3, centerDist));

    float iceShimmer = sin(uv.x * 100.0 + iTime) * sin(uv.y * 100.0 - iTime * 0.7) * 0.1;
    bodyColor += iceShimmer * crystal;

    float3 col = bgColor;
    col = mix(col, bodyColor, crystal);
    col += edgeColor * edge * 0.5;

    float glow = smoothstep(0.1, 0.0, d) * (1.0 - crystal);
    col += float3(0.2, 0.4, 0.8) * glow * 0.4;

    float outerGlow = exp(-centerDist * 3.0) * growth;
    col += float3(0.1, 0.2, 0.5) * outerGlow * 0.3;

    float sparkle = pow(dlaHash(floor(uv * 200.0) + floor(iTime * 5.0)), 20.0);
    col += float3(0.5, 0.7, 1.0) * sparkle * crystal * 0.5;

    col *= 1.0 - 0.4 * centerDist;

    return float4(col, 1.0);
}
