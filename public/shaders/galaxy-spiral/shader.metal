#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float gsHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float gsNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(gsHash(i), gsHash(i + float2(1.0, 0.0)), f.x),
               mix(gsHash(i + float2(0.0, 1.0)), gsHash(i + float2(1.0, 1.0)), f.x), f.y);
}

float gsFbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * gsNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float gsStars(float2 uv, float scale, float iTime) {
    float2 id = floor(uv * scale);
    float2 gv = fract(uv * scale) - 0.5;
    float h = gsHash(id);
    float sz = 0.03 + h * 0.03;
    float brightness = pow(h, 6.0);
    float star = smoothstep(sz, 0.0, length(gv - (float2(h, gsHash(id + 99.0)) - 0.5) * 0.5));
    float twinkle = 0.7 + 0.3 * sin(iTime * 3.0 + h * 100.0);
    return star * brightness * twinkle;
}

fragment float4 galaxySpiralFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime * 0.1;

    float r = length(uv);
    float theta = atan2(uv.y, uv.x);

    float rotation = t;
    theta -= rotation;

    float arms = 2.0;
    float spiral = theta * arms - log(r + 0.001) * 5.0;
    float armDensity = pow(0.5 + 0.5 * sin(spiral), 3.0);

    float radialFade = exp(-r * 2.5);

    float dust = gsFbm(float2(theta * 3.0 + t, r * 8.0)) * 0.5;
    float dustLane = smoothstep(0.3, 0.7, gsFbm(float2(spiral * 0.5, r * 4.0)));

    float density = armDensity * radialFade;
    density *= (1.0 - dustLane * 0.6);
    density += dust * radialFade * 0.3;

    float3 coreColor = float3(1.0, 0.95, 0.8);
    float3 armColor = float3(0.4, 0.5, 0.9);
    float3 dustColor = float3(0.8, 0.4, 0.2);

    float coreGlow = exp(-r * 8.0);
    float coreHalo = exp(-r * 3.0);

    float3 col = float3(0.0, 0.0, 0.02);

    col += armColor * density * 0.8;
    col += dustColor * dust * radialFade * dustLane * 0.3;
    col += coreColor * coreGlow * 2.0;
    col += float3(0.9, 0.8, 0.6) * coreHalo * 0.3;

    float bgStars = gsStars(uv + float2(100.0), 80.0, iTime);
    bgStars += gsStars(uv + float2(200.0), 120.0, iTime) * 0.5;
    bgStars += gsStars(uv + float2(300.0), 200.0, iTime) * 0.3;
    col += float3(0.9, 0.9, 1.0) * bgStars * (1.0 - radialFade * 0.8);

    float brightStars = gsStars(uv * 0.8, 40.0, iTime);
    col += float3(1.0, 0.95, 0.8) * brightStars * density * 3.0;

    float3 nebulaColor = mix(float3(0.1, 0.05, 0.2), float3(0.05, 0.1, 0.15), gsFbm(uv * 3.0));
    col += nebulaColor * radialFade * 0.2;

    col = 1.0 - exp(-col * 1.5);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
