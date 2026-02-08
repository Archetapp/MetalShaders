#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 mod289_m(float3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float2 mod289_m(float2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float3 permute_m(float3 x) { return mod289_m(((x * 34.0) + 10.0) * x); }

float snoise(float2 v) {
    const float4 C = float4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
    float2 i = floor(v + dot(v, C.yy));
    float2 x0 = v - i + dot(i, C.xx);
    float2 i1 = (x0.x > x0.y) ? float2(1.0, 0.0) : float2(0.0, 1.0);
    float4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289_m(i);
    float3 p = permute_m(permute_m(i.y + float3(0.0, i1.y, 1.0)) + i.x + float3(0.0, i1.x, 1.0));
    float3 m = max(0.5 - float3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    float3 x = 2.0 * fract(p * C.www) - 1.0;
    float3 h = abs(x) - 0.5;
    float3 ox = floor(x + 0.5);
    float3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    float3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

fragment float4 meshGradientFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float t = iTime * 0.3;

    float2 p1 = float2(0.3 + 0.2 * sin(t * 0.7), 0.3 + 0.2 * cos(t * 0.9));
    float2 p2 = float2(0.7 + 0.15 * cos(t * 0.8), 0.6 + 0.2 * sin(t * 1.1));
    float2 p3 = float2(0.5 + 0.25 * sin(t * 0.6), 0.8 + 0.15 * cos(t * 0.7));
    float2 p4 = float2(0.2 + 0.2 * cos(t * 1.0), 0.7 + 0.15 * sin(t * 0.5));
    float2 p5 = float2(0.8 + 0.15 * sin(t * 0.9), 0.2 + 0.2 * cos(t * 0.6));

    float d1 = exp(-3.0 * length(uv - p1));
    float d2 = exp(-3.5 * length(uv - p2));
    float d3 = exp(-3.0 * length(uv - p3));
    float d4 = exp(-3.5 * length(uv - p4));
    float d5 = exp(-3.0 * length(uv - p5));

    float n = snoise(uv * 2.0 + t * 0.5) * 0.15;

    float3 col1 = float3(0.95, 0.4, 0.6);
    float3 col2 = float3(0.4, 0.6, 0.95);
    float3 col3 = float3(0.6, 0.3, 0.9);
    float3 col4 = float3(0.3, 0.85, 0.75);
    float3 col5 = float3(0.95, 0.7, 0.3);

    float3 col = col1 * d1 + col2 * d2 + col3 * d3 + col4 * d4 + col5 * d5;
    float total = d1 + d2 + d3 + d4 + d5 + 0.001;
    col /= total;

    col += n;
    col = clamp(col, 0.0, 1.0);

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
