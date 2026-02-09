#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float etHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 etDeform(float2 p, float t) {
    float freq = M_PI_F;
    p.x += sin(p.y * freq + t) * 0.15;
    p.y += sin(p.x * freq + t * 0.7) * 0.15;
    p.x += cos(p.y * freq * 0.5 + t * 1.3) * 0.08;
    p.y += cos(p.x * freq * 0.5 + t * 0.9) * 0.08;
    return p;
}

float etCreatureShape(float2 p, float cellType) {
    float body = length(p) - 0.35;

    if (cellType < 0.5) {
        float2 headP = p - float2(0.2, 0.15);
        float head = length(headP) - 0.12;
        body = min(body, head);

        float2 wingP1 = p - float2(-0.15, 0.2);
        float wing1 = length(wingP1 * float2(1.0, 2.0)) - 0.15;
        body = min(body, wing1);

        float2 wingP2 = p - float2(-0.15, -0.2);
        float wing2 = length(wingP2 * float2(1.0, 2.0)) - 0.15;
        body = min(body, wing2);

        float2 tailP = p - float2(-0.3, 0.0);
        float tail = length(tailP * float2(1.5, 3.0)) - 0.1;
        body = min(body, tail);
    } else {
        float2 finP1 = p - float2(0.1, 0.25);
        float fin1 = length(finP1 * float2(2.0, 1.0)) - 0.12;
        body = min(body, fin1);

        float2 finP2 = p - float2(0.1, -0.25);
        float fin2 = length(finP2 * float2(2.0, 1.0)) - 0.12;
        body = min(body, fin2);

        float2 tailP = p - float2(-0.35, 0.0);
        float tail = length(tailP * float2(1.0, 2.5)) - 0.12;
        body = min(body, tail);
    }

    return body;
}

fragment float4 escherTessellationFragment(VertexOut in [[stage_in]],
                                            constant float &iTime [[buffer(0)]],
                                            constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float t = iTime * 0.4;
    float scale = 2.5;
    float2 p = uv * scale;

    float2 deformed = etDeform(p, t);

    float2 cell = floor(deformed + 0.5);
    float2 f = deformed - cell;

    float cellType = fmod(cell.x + cell.y, 2.0);

    float creature = etCreatureShape(f, cellType);

    float3 col1, col2;
    float phase = sin(iTime * 0.3) * 0.5 + 0.5;
    col1 = mix(float3(0.15, 0.35, 0.55), float3(0.55, 0.25, 0.15), phase);
    col2 = mix(float3(0.85, 0.75, 0.55), float3(0.45, 0.65, 0.85), phase);

    float3 baseColor = cellType < 0.5 ? col1 : col2;

    float shade = smoothstep(0.35, 0.0, length(f));
    baseColor *= 0.7 + 0.3 * shade;

    float bodyGrad = 1.0 - smoothstep(0.0, 0.4, length(f));
    baseColor *= 0.85 + 0.15 * bodyGrad;

    if (cellType < 0.5) {
        float2 eyeP = f - float2(0.22, 0.18);
        float eye = smoothstep(0.04, 0.03, length(eyeP));
        baseColor = mix(baseColor, float3(0.0), eye);
        float eyeHighlight = smoothstep(0.02, 0.015, length(eyeP - float2(0.01, 0.01)));
        baseColor = mix(baseColor, float3(1.0), eyeHighlight * 0.8);
    } else {
        float2 eyeP = f - float2(0.15, 0.05);
        float eye = smoothstep(0.035, 0.025, length(eyeP));
        baseColor = mix(baseColor, float3(0.0), eye);
        float eyeHighlight = smoothstep(0.015, 0.01, length(eyeP - float2(0.008, 0.008)));
        baseColor = mix(baseColor, float3(1.0), eyeHighlight * 0.8);
    }

    float edgeDist = abs(creature);
    float outline = smoothstep(0.02, 0.005, edgeDist);
    baseColor = mix(baseColor, float3(0.05), outline * 0.6);

    float pattern = sin(f.x * 20.0 + f.y * 20.0 + iTime) * 0.03;
    baseColor += pattern;

    float3 col = baseColor;
    col *= 1.0 - 0.25 * length(uv);

    return float4(col, 1.0);
}
