#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float4 hgHexCoord(float2 uv) {
    float2 r = float2(1.0, 1.732);
    float2 h = r * 0.5;
    float2 a = fmod(uv, r) - h;
    float2 b = fmod(uv - h, r) - h;
    float2 gv;
    if (length(a) < length(b))
        gv = a;
    else
        gv = b;
    float2 id = uv - gv;
    return float4(gv.x, gv.y, id.x, id.y);
}

float hgHexDist(float2 p) {
    p = abs(p);
    float d = dot(p, normalize(float2(1.0, 1.732)));
    return max(d, p.x);
}

float3 hgPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + float3(0.0, 0.33, 0.67)));
}

fragment float4 hexagonalGridFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    uv *= 8.0;

    float4 hex = hgHexCoord(uv);
    float2 gv = hex.xy;
    float2 id = hex.zw;

    float d = hgHexDist(gv);
    float cellDist = length(id);

    float wave = sin(cellDist * 0.8 - t * 2.0) * 0.5 + 0.5;
    float wave2 = sin(cellDist * 0.5 - t * 1.5 + 3.14) * 0.5 + 0.5;

    float pulse = pow(wave, 3.0);

    float edge = smoothstep(0.45, 0.4, d);
    float edgeGlow = smoothstep(0.48, 0.42, d) - smoothstep(0.42, 0.36, d);

    float cellHash = fract(sin(dot(id, float2(127.1, 311.7))) * 43758.5453);
    float cellPulse = sin(t * 2.0 + cellHash * 6.28) * 0.5 + 0.5;

    float3 baseColor = hgPalette(cellDist * 0.1 + t * 0.1);
    float3 edgeColor = hgPalette(cellDist * 0.1 + t * 0.1 + 0.5);

    float3 col = float3(0.02);
    col += baseColor * edge * pulse * 0.6;
    col += baseColor * cellPulse * edge * 0.2;
    col += edgeColor * edgeGlow * 1.5;

    float center = exp(-length(gv) * 6.0);
    col += baseColor * center * wave2 * 0.8;

    float innerGlow = smoothstep(0.3, 0.0, d) * pulse;
    col += baseColor * innerGlow * 0.3;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
