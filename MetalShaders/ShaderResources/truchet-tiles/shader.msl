#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hash21Truchet(float2 p) {
    p = fract(p * float2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

fragment float4 truchetTilesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.2;

    float scale = 8.0;
    uv *= scale;

    float2 id = floor(uv);
    float2 gv = fract(uv);

    float rnd = hash21Truchet(id + floor(t) * 0.1);

    bool flip = rnd > 0.5;

    if (flip) gv.x = 1.0 - gv.x;

    float d1 = abs(length(gv) - 1.0);
    float d2 = abs(length(gv - 1.0) - 1.0);

    float d = min(d1, d2);

    float lineWidth = 0.08;
    float line = smoothstep(lineWidth + 0.02, lineWidth, d);

    float colorPhase = hash21Truchet(id * 7.0 + 13.0);
    float3 lineCol;
    lineCol.r = sin(colorPhase * 6.28 + 0.0) * 0.3 + 0.6;
    lineCol.g = sin(colorPhase * 6.28 + 2.09) * 0.3 + 0.6;
    lineCol.b = sin(colorPhase * 6.28 + 4.18) * 0.3 + 0.6;

    float glow = exp(-d * 8.0) * 0.3;

    float3 bg = float3(0.03, 0.03, 0.06);
    float3 col = bg;
    col += lineCol * glow;
    col = mix(col, lineCol, line);

    float edgeDist = min(min(gv.x, 1.0 - gv.x), min(gv.y, 1.0 - gv.y));
    float gridLine = smoothstep(0.02, 0.03, edgeDist);
    col *= mix(0.7, 1.0, gridLine);

    return float4(col, 1.0);
}
