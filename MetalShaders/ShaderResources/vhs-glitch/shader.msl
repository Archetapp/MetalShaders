#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float vhsHashMtl(float n) { return fract(sin(n) * 43758.5453); }
float vhsHash2Mtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

float vhsNoiseMtl(float y, float t) {
    return vhsHashMtl(floor(y * 20.0) + floor(t * 10.0));
}

fragment float4 vhsGlitchFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.position.xy / iResolution;
    float2 centered = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float trackingError = 0.0;
    float glitchLine = vhsNoiseMtl(uv.y, iTime);
    if (glitchLine > 0.95) {
        trackingError = (vhsHashMtl(floor(iTime * 5.0) + floor(uv.y * 30.0)) - 0.5) * 0.1;
    }
    if (glitchLine > 0.98) { trackingError *= 3.0; }

    float scanJitter = sin(uv.y * 500.0 + iTime * 100.0) * 0.001;
    float bigGlitch = step(0.97, vhsHashMtl(floor(iTime * 3.0))) * (vhsHashMtl(floor(uv.y * 5.0 + iTime * 10.0)) - 0.5) * 0.05;

    float2 uvR = uv + float2(trackingError + scanJitter + bigGlitch + 0.003, 0.0);
    float2 uvG = uv + float2(trackingError + scanJitter + bigGlitch, 0.0);
    float2 uvB = uv + float2(trackingError + scanJitter + bigGlitch - 0.003, 0.0);

    float r = (0.5 + 0.5 * cos(iTime + (uvR.x - 0.5) * 3.0));
    float g = (0.5 + 0.5 * cos(iTime + (uvG.y - 0.5) * 3.0 + 2.0));
    float b = (0.5 + 0.5 * cos(iTime + (uvB.x - 0.5) * 3.0 + 4.0));
    float3 col = float3(r, g, b);

    float scanline = sin(uv.y * iResolution.y * M_PI_F) * 0.1;
    col -= scanline;

    float vignette = 1.0 - pow(length(centered) * 1.2, 2.5);
    col *= vignette;

    col *= 0.9 + 0.1 * vhsHash2Mtl(uv * iResolution + iTime);

    float whiteNoise = vhsHash2Mtl(float2(uv.y * 100.0, iTime * 50.0));
    if (whiteNoise > 0.993) { col = float3(vhsHash2Mtl(uv + iTime)); }

    col = mix(col, float3(dot(col, float3(0.299, 0.587, 0.114))), 0.15);

    return float4(col, 1.0);
}
