#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float penroseSegMtl(float2 p, float2 a, float2 b, float width) {
    float2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    return smoothstep(width + 0.003, width - 0.003, d);
}

fragment float4 impossibleTriangleFragment(VertexOut in [[stage_in]],
                                            constant float &iTime [[buffer(0)]],
                                            constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float rot = iTime * 0.3;
    float c = cos(rot), s = sin(rot);
    uv = float2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

    float3 col = float3(0.95, 0.93, 0.9);

    float size = 0.25;
    float w = 0.04;
    float h30 = 0.866;

    float2 v0 = float2(0.0, size);
    float2 v1 = float2(-size * h30, -size * 0.5);
    float2 v2 = float2(size * h30, -size * 0.5);

    float2 d01 = normalize(v1 - v0);
    float2 d12 = normalize(v2 - v1);
    float2 d20 = normalize(v0 - v2);
    float2 n01 = float2(-d01.y, d01.x);
    float2 n12 = float2(-d12.y, d12.x);
    float2 n20 = float2(-d20.y, d20.x);

    float bar0 = penroseSegMtl(uv, v0, v1, w);
    float bar1 = penroseSegMtl(uv, v1, v2, w);
    float bar2 = penroseSegMtl(uv, v2, v0, w);

    float along0 = dot(uv - v0, d01) / length(v1 - v0);
    float along1 = dot(uv - v1, d12) / length(v2 - v1);
    float along2 = dot(uv - v2, d20) / length(v0 - v2);

    float3 shade0 = mix(float3(0.6, 0.5, 0.7), float3(0.4, 0.3, 0.5), along0);
    float3 shade1 = mix(float3(0.5, 0.6, 0.7), float3(0.3, 0.4, 0.5), along1);
    float3 shade2 = mix(float3(0.7, 0.5, 0.6), float3(0.5, 0.3, 0.4), along2);

    float side0 = dot(uv - v0, n01);
    shade0 *= (side0 > 0.0) ? 1.1 : 0.85;
    float side1 = dot(uv - v1, n12);
    shade1 *= (side1 > 0.0) ? 1.1 : 0.85;
    float side2 = dot(uv - v2, n20);
    shade2 *= (side2 > 0.0) ? 1.1 : 0.85;

    col = mix(col, shade0, bar0 * 0.9);
    col = mix(col, shade1, bar1 * 0.9);
    col = mix(col, shade2, bar2 * 0.9);

    float outer0 = penroseSegMtl(uv, v0 + n01 * w, v1 + n01 * w, 0.008);
    float inner0 = penroseSegMtl(uv, v0 - n01 * w, v1 - n01 * w, 0.008);
    float outer1 = penroseSegMtl(uv, v1 + n12 * w, v2 + n12 * w, 0.008);
    float inner1 = penroseSegMtl(uv, v1 - n12 * w, v2 - n12 * w, 0.008);
    float outer2 = penroseSegMtl(uv, v2 + n20 * w, v0 + n20 * w, 0.008);
    float inner2 = penroseSegMtl(uv, v2 - n20 * w, v0 - n20 * w, 0.008);

    float edges = max(max(outer0, inner0), max(max(outer1, inner1), max(outer2, inner2)));
    col = mix(col, float3(0.15), edges * 0.8);

    return float4(col, 1.0);
}
