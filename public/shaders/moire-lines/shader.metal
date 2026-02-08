#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 mlRotate(float2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return float2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float mlLines(float2 uv, float angle, float freq, float thickness) {
    float2 rotUV = mlRotate(uv, angle);
    float line = abs(sin(rotUV.x * freq * M_PI_F));
    return smoothstep(thickness, thickness + 0.02, line);
}

fragment float4 moireLinesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float angle1 = t * 0.15;
    float angle2 = -t * 0.12 + 0.5;
    float angle3 = t * 0.08 + 1.0;

    float freq1 = 30.0 + sin(t * 0.3) * 5.0;
    float freq2 = 32.0 + cos(t * 0.4) * 5.0;
    float freq3 = 28.0 + sin(t * 0.5 + 1.0) * 4.0;

    float thickness = 0.3;

    float grid1 = mlLines(uv, angle1, freq1, thickness);
    float grid2 = mlLines(uv, angle2, freq2, thickness);
    float grid3 = mlLines(uv, angle3, freq3, thickness);

    float moire1 = grid1 * grid2;
    float moire2 = grid2 * grid3;
    float moire3 = grid1 * grid3;

    float3 col = float3(0.02);
    col += float3(0.9, 0.3, 0.2) * (1.0 - moire1) * 0.5;
    col += float3(0.2, 0.5, 0.9) * (1.0 - moire2) * 0.5;
    col += float3(0.3, 0.8, 0.4) * (1.0 - moire3) * 0.3;

    float combined = (1.0 - grid1) * 0.33 + (1.0 - grid2) * 0.33 + (1.0 - grid3) * 0.33;
    col += float3(0.9) * combined * 0.3;

    float pulse = 0.5 + 0.5 * sin(length(uv) * 10.0 - t * 2.0);
    col *= 0.8 + 0.2 * pulse;

    float vig = 1.0 - 0.3 * dot(uv, uv);
    col *= vig;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
