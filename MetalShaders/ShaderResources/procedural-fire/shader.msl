#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float pfHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float pfNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = pfHash(i);
    float b = pfHash(i + float2(1.0, 0.0));
    float c = pfHash(i + float2(0.0, 1.0));
    float d = pfHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float pfFbm(float2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 6; i++) {
        val += amp * pfNoise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    return val;
}

float3 pfFireColor(float temp) {
    float3 col;
    if (temp < 0.25) {
        col = mix(float3(0.0), float3(0.5, 0.0, 0.0), temp * 4.0);
    } else if (temp < 0.5) {
        col = mix(float3(0.5, 0.0, 0.0), float3(1.0, 0.4, 0.0), (temp - 0.25) * 4.0);
    } else if (temp < 0.75) {
        col = mix(float3(1.0, 0.4, 0.0), float3(1.0, 0.9, 0.2), (temp - 0.5) * 4.0);
    } else {
        col = mix(float3(1.0, 0.9, 0.2), float3(1.0, 1.0, 0.9), (temp - 0.75) * 4.0);
    }
    return col;
}

fragment float4 proceduralFireFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    uv.y += 0.3;

    float2 fireUV = uv;
    fireUV.y -= t * 1.5;

    float n1 = pfFbm(fireUV * 4.0 + float2(t * 0.5, 0.0));
    float n2 = pfFbm(fireUV * 8.0 + float2(-t * 0.3, t * 0.5));
    float n3 = pfFbm(fireUV * 2.0 + float2(t * 0.2, -t * 0.8));

    float turb = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    float shape = 1.0 - smoothstep(0.0, 0.6, abs(uv.x) * (1.0 + uv.y * 0.5));
    shape *= 1.0 - smoothstep(-0.4, 0.5, uv.y);
    shape *= smoothstep(-0.8, -0.4, uv.y);

    float temp = shape * turb * 2.0;
    temp = clamp(temp, 0.0, 1.0);

    float flicker = 0.95 + 0.05 * sin(t * 15.0 + uv.x * 10.0);
    temp *= flicker;

    float3 col = pfFireColor(temp);

    float glow = exp(-length(uv - float2(0.0, -0.2)) * 2.0) * temp;
    col += float3(1.0, 0.3, 0.05) * glow * 0.5;

    float ember = pfNoise(uv * 20.0 + float2(0.0, -t * 3.0));
    ember = pow(ember, 8.0) * shape * 2.0;
    col += float3(1.0, 0.6, 0.1) * ember;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
