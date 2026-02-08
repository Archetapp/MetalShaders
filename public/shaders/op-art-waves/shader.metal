#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 opArtWavesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float freq = 25.0;

    float wave1 = sin(uv.y * freq + sin(uv.x * 3.0 + t) * 2.0);
    float wave2 = sin(uv.y * freq * 0.5 + sin(uv.x * 5.0 - t * 0.7) * 1.5 + 1.0);
    float wave3 = sin(uv.y * freq * 0.7 + sin(uv.x * 2.0 + t * 1.3) * 3.0 - 0.5);

    float distort = sin(length(uv) * 4.0 - t) * 0.5;
    float radial = sin(uv.y * freq + distort * freq * 0.3);

    float combined = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2 + radial * 0.1;

    float bulge = sin(uv.x * M_PI_F * 2.0 + t * 0.5) * sin(uv.y * M_PI_F * 2.0 + t * 0.3);
    float widthMod = 1.0 + bulge * 0.3;
    float modStripe = smoothstep(-0.1 * widthMod, 0.1 * widthMod, combined);

    float depth = abs(combined) * 0.5;
    float3 white = float3(0.95 + depth * 0.05);
    float3 black = float3(0.02 + depth * 0.03);

    float3 col = mix(black, white, modStripe);

    float edgeFade = smoothstep(0.05, 0.15, abs(fract(combined * 0.5 + 0.5) - 0.5));
    col = mix(col, col * 0.95, 1.0 - edgeFade);

    float vig = 1.0 - 0.4 * dot(uv, uv);
    col *= vig;

    return float4(col, 1.0);
}
