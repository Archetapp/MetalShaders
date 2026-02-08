#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float lcNoise(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float lcSmoothNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = lcNoise(i);
    float b = lcNoise(i + float2(1.0, 0.0));
    float c = lcNoise(i + float2(0.0, 1.0));
    float d = lcNoise(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float lcFbm(float2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
        val += amp * lcSmoothNoise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    return val;
}

float3 lcEnvMap(float3 dir) {
    float t = 0.5 + 0.5 * dir.y;
    float3 sky = mix(float3(0.8, 0.85, 0.9), float3(0.2, 0.4, 0.8), t);
    float sun = max(0.0, dot(dir, normalize(float3(1.0, 0.5, 0.3))));
    sky += float3(1.0, 0.9, 0.7) * pow(sun, 64.0);
    sky += float3(0.5, 0.4, 0.3) * pow(sun, 8.0);
    float grid = smoothstep(0.48, 0.5, abs(fract(dir.x * 4.0) - 0.5))
               + smoothstep(0.48, 0.5, abs(fract(dir.z * 4.0) - 0.5));
    sky = mix(sky, sky * 1.3, grid * 0.15);
    return sky;
}

fragment float4 liquidChromeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float t = iTime * 0.4;

    float2 warp = float2(
        lcFbm(uv * 3.0 + float2(t, 0.0)),
        lcFbm(uv * 3.0 + float2(0.0, t * 1.3))
    );

    float2 warpedUV = uv + (warp - 0.5) * 0.3;

    float height = lcFbm(warpedUV * 2.0 + t * 0.5);
    float eps = 0.005;
    float hx = lcFbm((warpedUV + float2(eps, 0.0)) * 2.0 + t * 0.5);
    float hy = lcFbm((warpedUV + float2(0.0, eps)) * 2.0 + t * 0.5);

    float3 normal = normalize(float3((height - hx) / eps, (height - hy) / eps, 1.0));

    float3 viewDir = normalize(float3(uv, 1.5));
    float3 reflDir = reflect(viewDir, normal);

    float3 envColor = lcEnvMap(reflDir);

    float fresnel = pow(1.0 - max(0.0, dot(-viewDir, normal)), 3.0);
    fresnel = mix(0.6, 1.0, fresnel);

    float3 chrome = float3(0.9, 0.92, 0.95);
    float3 col = chrome * envColor * fresnel;

    float3 lightDir = normalize(float3(1.0, 1.0, 0.5));
    float spec = pow(max(0.0, dot(reflect(-lightDir, normal), -viewDir)), 128.0);
    col += float3(1.0, 0.98, 0.95) * spec * 1.5;

    float rim = pow(1.0 - max(0.0, dot(-viewDir, normal)), 4.0);
    col += float3(0.6, 0.7, 0.9) * rim * 0.4;

    col = col / (col + 1.0);
    col = pow(col, float3(0.85));

    return float4(col, 1.0);
}
