#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashAurora(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float noiseAurora(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hashAurora(i), hashAurora(i + float2(1.0, 0.0)), f.x),
               mix(hashAurora(i + float2(0.0, 1.0)), hashAurora(i + float2(1.0, 1.0)), f.x), f.y);
}

float fbmAurora(float2 p) {
    float v = 0.0;
    float a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * noiseAurora(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

fragment float4 auroraBorealisFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 fragCoord = uv * iResolution;
    float t = iTime * 0.15;

    float3 skyDark = float3(0.0, 0.02, 0.05);
    float3 skyHorizon = float3(0.02, 0.05, 0.1);
    float3 sky = mix(skyHorizon, skyDark, uv.y);

    float stars = step(0.998, hashAurora(floor(fragCoord * 0.5)));
    sky += stars * 0.5;

    float3 auroraColor = float3(0.0);

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float speed = t * (0.5 + fi * 0.3);
        float yOffset = 0.5 + fi * 0.08;

        float wave = fbmAurora(float2(uv.x * 3.0 + speed, fi * 5.0 + t * 0.2));
        wave += sin(uv.x * 4.0 + t * 0.5 + fi) * 0.15;

        float curtainY = yOffset + wave * 0.15;
        float dist = uv.y - curtainY;

        float curtain = exp(-dist * dist * 80.0);
        curtain *= smoothstep(0.3, 0.5, uv.y);
        curtain *= smoothstep(1.0, 0.7, uv.y);

        float detail = fbmAurora(float2(uv.x * 8.0 + speed * 2.0, uv.y * 4.0 + fi * 3.0));
        curtain *= 0.5 + detail * 0.8;

        float3 c1 = float3(0.1, 0.8, 0.3);
        float3 c2 = float3(0.2, 0.4, 0.9);
        float3 c3 = float3(0.5, 0.1, 0.6);

        float colorMix = sin(uv.x * 2.0 + t + fi * 1.5) * 0.5 + 0.5;
        float3 curtainColor;
        if (colorMix < 0.5) {
            curtainColor = mix(c1, c2, colorMix * 2.0);
        } else {
            curtainColor = mix(c2, c3, (colorMix - 0.5) * 2.0);
        }

        float heightFade = smoothstep(curtainY - 0.1, curtainY + 0.1, uv.y);
        curtainColor = mix(curtainColor, c1, heightFade * 0.5);

        auroraColor += curtainColor * curtain * (0.5 + fi * 0.15);
    }

    float3 col = sky + auroraColor;
    col += auroraColor * 0.2 * (1.0 - uv.y);

    return float4(col, 1.0);
}
