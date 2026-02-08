#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float polaroidNoiseMtl(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

fragment float4 polaroidDevelopFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.9, 0.88, 0.85);

    float frameW = 0.3, frameH = 0.38;
    float frameMask = step(abs(uv.x), frameW) * step(abs(uv.y + 0.03), frameH);
    col = mix(col, float3(0.95, 0.93, 0.9), frameMask);

    float borderSide = 0.03, borderTop = 0.04, borderBottom = 0.1;
    float photoW = frameW - borderSide;
    float photoTop = frameH - 0.03 - borderTop;
    float photoBottom = -frameH + 0.03 + borderBottom;
    float photoH = (photoTop - photoBottom) * 0.5;
    float photoY = (photoTop + photoBottom) * 0.5;

    float photoMask = step(abs(uv.x), photoW) * step(abs(uv.y - photoY), photoH);

    float2 puv = float2(uv.x / photoW, (uv.y - photoY) / photoH);

    float3 scene = float3(0.0);
    float sky = smoothstep(-0.2, 0.5, puv.y);
    scene = mix(float3(0.2, 0.5, 0.1), float3(0.4, 0.6, 0.9), sky);
    float sun = smoothstep(0.2, 0.1, length(puv - float2(0.3, 0.6)));
    scene = mix(scene, float3(1.0, 0.9, 0.5), sun);
    float hills = smoothstep(-0.1, -0.15, puv.y - 0.05 * sin(puv.x * 5.0));
    scene = mix(scene, float3(0.15, 0.35, 0.1), hills);
    float tree = step(length((puv - float2(-0.3, 0.1)) * float2(1.0, 0.5)), 0.15);
    scene = mix(scene, float3(0.1, 0.25, 0.05), tree);

    float develop = fmod(iTime * 0.15, 1.2);
    float developMask = smoothstep(0.0, 0.8, develop);
    float devNoise = polaroidNoiseMtl(puv * 5.0 + iTime * 0.1);
    developMask *= 0.7 + 0.3 * devNoise;
    developMask = clamp(developMask, 0.0, 1.0);

    float3 undeveloped = float3(0.85, 0.82, 0.75);
    float3 developing = mix(undeveloped, scene, developMask);

    float sepia = dot(developing, float3(0.299, 0.587, 0.114));
    float sepiaAmount = smoothstep(0.6, 1.0, developMask);
    developing = mix(float3(sepia * 1.1, sepia * 0.9, sepia * 0.7), developing, sepiaAmount);
    developing *= 0.95 + 0.05 * polaroidNoiseMtl(in.position.xy);

    col = mix(col, developing, photoMask);

    return float4(col, 1.0);
}
