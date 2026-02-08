#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float nnHashMtl(float n) { return fract(sin(n) * 43758.5453); }

float2 nnNodePosMtl(float id) {
    return float2(nnHashMtl(id * 17.31) - 0.5, nnHashMtl(id * 23.17) - 0.5) * 0.8;
}

fragment float4 neuralNetworkFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.01, 0.02, 0.05);

    float connectionDist = 0.35;

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float2 ni = nnNodePosMtl(fi);
        ni += float2(sin(iTime * 0.5 + fi), cos(iTime * 0.3 + fi * 1.3)) * 0.02;

        for (int j = i + 1; j < 20; j++) {
            float fj = float(j);
            float2 nj = nnNodePosMtl(fj);
            nj += float2(sin(iTime * 0.5 + fj), cos(iTime * 0.3 + fj * 1.3)) * 0.02;

            float dist = length(ni - nj);
            if (dist < connectionDist) {
                float2 pa = uv - ni, ba = nj - ni;
                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                float d = length(pa - ba * h);
                float line = smoothstep(0.003, 0.001, d);

                float signal = sin(h * 10.0 - iTime * 3.0 + fi + fj) * 0.5 + 0.5;
                signal = pow(signal, 4.0);
                float alpha = (1.0 - dist / connectionDist) * 0.3;
                col += line * mix(float3(0.1, 0.15, 0.3), float3(0.3, 0.6, 1.0), signal) * alpha;
            }
        }
    }

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float2 ni = nnNodePosMtl(fi);
        ni += float2(sin(iTime * 0.5 + fi), cos(iTime * 0.3 + fi * 1.3)) * 0.02;

        float d = length(uv - ni);
        float node = smoothstep(0.012, 0.005, d);
        float pulse = 0.5 + 0.5 * sin(iTime * 2.0 + fi * 1.7);
        float glow = exp(-d * 40.0) * (0.3 + 0.7 * pow(pulse, 3.0));

        float3 nodeCol = mix(float3(0.2, 0.4, 0.8), float3(0.5, 0.8, 1.0), pulse);
        col += node * nodeCol;
        col += glow * nodeCol * 0.5;
    }

    return float4(col, 1.0);
}
