#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float fluidSimHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float fluidSimNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fluidSimHash(i);
    float b = fluidSimHash(i + float2(1.0, 0.0));
    float c = fluidSimHash(i + float2(0.0, 1.0));
    float d = fluidSimHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fluidSimFbm(float2 p, int octaves) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        v += a * fluidSimNoise(p);
        p = rot * p * 2.0 + float2(100.0);
        a *= 0.5;
    }
    return v;
}

float2 fluidSimCurl(float2 p, float t) {
    float eps = 0.01;
    float n1 = fluidSimFbm(p + float2(eps, 0.0) + t * 0.1, 5);
    float n2 = fluidSimFbm(p - float2(eps, 0.0) + t * 0.1, 5);
    float n3 = fluidSimFbm(p + float2(0.0, eps) + t * 0.1, 5);
    float n4 = fluidSimFbm(p - float2(0.0, eps) + t * 0.1, 5);
    return float2(n3 - n4, -(n1 - n2)) / (2.0 * eps);
}

fragment float4 fluidSimulationFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    float2 p = (uv - 0.5) * float2(aspect, 1.0);

    float t = iTime * 0.3;

    float2 curl1 = fluidSimCurl(p * 2.0, t);
    float2 curl2 = fluidSimCurl(p * 3.0 + curl1 * 0.3, t * 1.3);
    float2 curl3 = fluidSimCurl(p * 1.5 + curl2 * 0.2, t * 0.7);

    float2 advected = p + curl1 * 0.15 + curl2 * 0.1 + curl3 * 0.05;

    float pattern1 = fluidSimFbm(advected * 3.0 + t * 0.2, 6);
    float pattern2 = fluidSimFbm(advected * 4.0 - t * 0.15 + 5.0, 6);
    float pattern3 = fluidSimFbm(advected * 2.5 + t * 0.1 + 10.0, 6);

    float3 color1 = float3(0.9, 0.2, 0.4);
    float3 color2 = float3(0.2, 0.5, 0.9);
    float3 color3 = float3(0.1, 0.8, 0.6);
    float3 color4 = float3(0.95, 0.6, 0.1);
    float3 color5 = float3(0.7, 0.2, 0.9);

    float blend1 = smoothstep(0.3, 0.7, pattern1);
    float blend2 = smoothstep(0.35, 0.65, pattern2);
    float blend3 = smoothstep(0.4, 0.6, pattern3);

    float3 col = mix(color1, color2, blend1);
    col = mix(col, color3, blend2 * 0.7);
    col = mix(col, color4, blend3 * 0.5);

    float vortexStrength = length(curl1) * 2.0;
    col = mix(col, color5, smoothstep(0.5, 2.0, vortexStrength) * 0.4);

    float detail = fluidSimFbm(advected * 8.0 + t * 0.3, 4);
    col += float3(detail * 0.15);

    float luminance = dot(col, float3(0.299, 0.587, 0.114));
    float specular = pow(max(luminance, 0.0), 4.0) * 0.3;
    col += float3(specular);

    col = mix(col, col * col, 0.1);
    col = clamp(col, 0.0, 1.0);

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
