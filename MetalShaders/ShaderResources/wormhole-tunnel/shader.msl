#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float whNoiseMtl(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

fragment float4 wormholeTunnelFragment(VertexOut in [[stage_in]],
                                        constant float &iTime [[buffer(0)]],
                                        constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.0);

    float r = length(uv);
    float a = atan2(uv.y, uv.x);
    float tunnel = 0.2 / (r + 0.01);
    float twist = a / (2.0 * M_PI_F) + tunnel * 0.1 + iTime * 0.1;

    float texU = twist;
    float texV = tunnel - iTime * 2.0;

    float grid = smoothstep(0.02, 0.0, abs(fract(texU * 8.0) - 0.5) - 0.45) +
                 smoothstep(0.02, 0.0, abs(fract(texV * 4.0) - 0.5) - 0.45);
    grid = clamp(grid, 0.0, 1.0);

    float depth = exp(-r * 3.0);
    float3 tunnelCol = mix(float3(0.05, 0.0, 0.15), float3(0.2, 0.1, 0.4), depth);
    tunnelCol += grid * float3(0.3, 0.2, 0.6) * 0.5 * (1.0 - depth * 0.5);

    float distortion = whNoiseMtl(float2(texU * 10.0, texV * 5.0));
    float3 warpCol = mix(float3(0.1, 0.0, 0.3), float3(0.5, 0.2, 0.8), distortion);
    tunnelCol = mix(tunnelCol, warpCol, 0.3);

    float edgeGlow = exp(-r * 8.0);
    tunnelCol += float3(0.5, 0.3, 1.0) * edgeGlow;

    float centerLight = exp(-r * r * 20.0);
    tunnelCol += float3(0.8, 0.9, 1.0) * centerLight;

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float starA = whNoiseMtl(float2(fi, 0.0)) * 2.0 * M_PI_F;
        float starR = whNoiseMtl(float2(0.0, fi)) * 0.5;
        float speed = 0.5 + whNoiseMtl(float2(fi, fi)) * 1.5;
        float starDepth = fract(starR - iTime * speed * 0.1);
        float2 starPos = float2(cos(starA), sin(starA)) * starDepth;
        float d = length(uv - starPos);
        float streak = exp(-d * d * 2000.0) * (1.0 - starDepth);
        tunnelCol += float3(0.7, 0.8, 1.0) * streak;
    }

    col = tunnelCol;
    return float4(col, 1.0);
}
