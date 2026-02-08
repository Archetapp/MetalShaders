#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bmHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float bmNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(bmHash(i), bmHash(i + float2(1.0, 0.0)), f.x),
               mix(bmHash(i + float2(0.0, 1.0)), bmHash(i + float2(1.0, 1.0)), f.x), f.y);
}

float bmBrushTexture(float2 uv) {
    float tex = 0.0;
    tex += bmNoise(float2(uv.x * 200.0, uv.y * 5.0)) * 0.5;
    tex += bmNoise(float2(uv.x * 400.0, uv.y * 8.0)) * 0.25;
    tex += bmNoise(float2(uv.x * 800.0, uv.y * 12.0)) * 0.125;
    tex += bmNoise(float2(uv.x * 50.0, uv.y * 2.0)) * 0.3;
    return tex;
}

fragment float4 brushedMetalFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float brushTex = bmBrushTexture(uv);

    float3 baseColor = float3(0.55, 0.57, 0.6);
    baseColor *= 0.85 + 0.15 * brushTex;

    float3 normal = normalize(float3(
        (bmBrushTexture(uv + float2(0.001, 0.0)) - bmBrushTexture(uv - float2(0.001, 0.0))) * 0.5,
        (bmBrushTexture(uv + float2(0.0, 0.001)) - bmBrushTexture(uv - float2(0.0, 0.001))) * 0.1,
        1.0
    ));

    float lightAngle = t * 0.5;
    float3 lightPos = float3(sin(lightAngle) * 1.5, cos(lightAngle * 0.7) * 0.8, 2.0);
    float3 fragPos = float3(uv, 0.0);
    float3 lightDir = normalize(lightPos - fragPos);
    float3 viewDir = float3(0.0, 0.0, 1.0);

    float diff = max(0.0, dot(normal, lightDir));

    float3 halfDir = normalize(lightDir + viewDir);
    float3 brushDir = normalize(float3(1.0, 0.0, 0.0));

    float tDot = dot(brushDir, halfDir);
    float aniso = sqrt(max(0.0, 1.0 - tDot * tDot));
    float anisoSpec = pow(aniso, 16.0);

    float isoSpec = pow(max(0.0, dot(reflect(-lightDir, normal), viewDir)), 64.0);

    float spec = mix(isoSpec, anisoSpec, 0.7);

    float3 col = baseColor * (0.15 + diff * 0.6);
    col += float3(1.0, 0.98, 0.95) * spec * 1.2;

    float rim = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
    col += float3(0.4, 0.45, 0.5) * rim * 0.15;

    float fresnel = 0.04 + 0.96 * pow(1.0 - max(0.0, dot(normal, viewDir)), 5.0);
    col = mix(col, col * 1.3, fresnel * 0.3);

    float scratch = smoothstep(0.75, 0.8, bmNoise(uv * float2(300.0, 3.0)));
    col += float3(0.3) * scratch * spec;

    float vig = 1.0 - 0.25 * dot(uv, uv);
    col *= vig;

    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
