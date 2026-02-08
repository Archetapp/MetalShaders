#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float coralNoiseMtl(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, float2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + float2(1.0, 0.0), float2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + float2(0.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + float2(1.0, 1.0), float2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float coralFbmMtl(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * coralNoiseMtl(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float coralBranchMtl(float2 p, float phase) {
    float branch = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = phase + fi * 1.2566;
        float2 dir = float2(cos(angle), sin(angle));
        float d = abs(dot(p, float2(-dir.y, dir.x)));
        float along = dot(p, dir);
        float width = 0.02 * (1.0 - smoothstep(0.0, 0.3, along));
        branch += smoothstep(width, width * 0.3, d) * step(0.0, along) * step(along, 0.25);
    }
    return clamp(branch, 0.0, 1.0);
}

fragment float4 coralReefFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0, 0.05, 0.15);

    float waterCaustic = coralFbmMtl(uv * 5.0 + iTime * 0.3);
    col += float3(0.0, 0.05, 0.1) * waterCaustic;

    for (int j = 0; j < 4; j++) {
        float fj = float(j);
        float2 offset = float2(sin(fj * 2.5) * 0.25, -0.2 + fj * 0.05);
        float phase = fj * 0.8 + iTime * 0.1;
        float branch = coralBranchMtl(uv - offset, phase);

        float3 coralColor = 0.5 + 0.5 * cos(fj * 1.5 + float3(0.0, 1.0, 2.0) + iTime * 0.2);
        coralColor = mix(coralColor, float3(1.0, 0.3, 0.4), 0.3);

        float sss = coralFbmMtl((uv - offset) * 8.0 + iTime * 0.5);
        coralColor += float3(0.2, 0.05, 0.0) * sss;

        col = mix(col, coralColor, branch * 0.8);
    }

    float light = 0.5 + 0.5 * sin(iTime * 0.8 + uv.x * 3.0);
    col += float3(0.0, 0.02, 0.05) * light;

    return float4(col, 1.0);
}
