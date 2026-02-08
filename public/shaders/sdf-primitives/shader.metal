#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float sdCircleSDF(float2 p, float r) {
    return length(p) - r;
}

float sdBoxSDF(float2 p, float2 b) {
    float2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdTriangleSDF(float2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = float2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
}

float sdStarSDF(float2 p, float r, int n, float m) {
    float an = M_PI_F / float(n);
    float en = M_PI_F / m;
    float2 acs = float2(cos(an), sin(an));
    float2 ecs = float2(cos(en), sin(en));
    float bn = fmod(atan2(p.x, p.y), 2.0 * an) - an;
    p = length(p) * float2(cos(bn), abs(sin(bn)));
    p -= r * acs;
    p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
    return length(p) * sign(p.x);
}

float sdHeartSDF(float2 p) {
    p.x = abs(p.x);
    if (p.y + p.x > 1.0) {
        return sqrt(dot(p - float2(0.25, 0.75), p - float2(0.25, 0.75))) - sqrt(2.0) / 4.0;
    }
    return sqrt(min(dot(p - float2(0.0, 1.0), p - float2(0.0, 1.0)),
                    dot(p - 0.5 * max(p.x + p.y, 0.0), p - 0.5 * max(p.x + p.y, 0.0)))) *
           sign(p.x - p.y);
}

float3 renderShapeSDF(float d, float3 shapeColor) {
    float edge = smoothstep(0.01, 0.0, abs(d)) * 0.8;
    float fill = smoothstep(0.01, -0.01, d);
    float glow = exp(-abs(d) * 40.0) * 0.5;
    float3 col = shapeColor * fill * 0.6;
    col += shapeColor * edge;
    col += shapeColor * glow * 0.3;
    return col;
}

fragment float4 sdfPrimitivesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    float3 col = float3(0.02, 0.02, 0.04);

    float morphT = fract(t * 0.2);
    int shapeA = int(fmod(floor(t * 0.2), 5.0));
    int shapeB = int(fmod(floor(t * 0.2) + 1.0, 5.0));

    float dA, dB;
    float3 colA, colB;

    float pulse = sin(t * 2.0) * 0.02;
    float r = 0.25 + pulse;
    float rot = t * 0.3;
    float2x2 rm = float2x2(cos(rot), -sin(rot), sin(rot), cos(rot));
    float2 p = rm * uv;

    if (shapeA == 0) { dA = sdCircleSDF(p, r); colA = float3(0.3, 0.6, 1.0); }
    else if (shapeA == 1) { dA = sdBoxSDF(p, float2(r * 0.8)); colA = float3(1.0, 0.4, 0.3); }
    else if (shapeA == 2) { dA = sdTriangleSDF(p, r); colA = float3(0.3, 1.0, 0.5); }
    else if (shapeA == 3) { dA = sdStarSDF(p, r * 0.9, 5, 2.5); colA = float3(1.0, 0.8, 0.2); }
    else { dA = sdHeartSDF(p * 3.5) / 3.5; colA = float3(1.0, 0.3, 0.5); }

    if (shapeB == 0) { dB = sdCircleSDF(p, r); colB = float3(0.3, 0.6, 1.0); }
    else if (shapeB == 1) { dB = sdBoxSDF(p, float2(r * 0.8)); colB = float3(1.0, 0.4, 0.3); }
    else if (shapeB == 2) { dB = sdTriangleSDF(p, r); colB = float3(0.3, 1.0, 0.5); }
    else if (shapeB == 3) { dB = sdStarSDF(p, r * 0.9, 5, 2.5); colB = float3(1.0, 0.8, 0.2); }
    else { dB = sdHeartSDF(p * 3.5) / 3.5; colB = float3(1.0, 0.3, 0.5); }

    float smooth_t = smoothstep(0.0, 1.0, morphT);
    float d = mix(dA, dB, smooth_t);
    float3 shapeCol = mix(colA, colB, smooth_t);

    col += renderShapeSDF(d, shapeCol);

    return float4(col, 1.0);
}
