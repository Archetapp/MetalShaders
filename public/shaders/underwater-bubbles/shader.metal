#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float underwaterBubbleHash(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 underwaterBubblesFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));
    float3 waterColor = mix(float3(0.0, 0.08, 0.15), float3(0.0, 0.15, 0.3), uv.y + 0.5);
    waterColor += sin(uv.x * 15.0 + iTime) * sin(uv.y * 12.0 + iTime * 0.7) * 0.05;
    float3 col = waterColor;

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float speed = 0.1 + underwaterBubbleHash(fi * 1.23) * 0.15;
        float xBase = (underwaterBubbleHash(fi * 2.47) - 0.5) * 0.8;
        float wobble = sin(iTime * (1.0 + underwaterBubbleHash(fi * 3.71)) + fi) * 0.03;
        float yPos = fmod(-0.6 + iTime * speed + fi * 0.3, 1.4) - 0.7;
        float size = 0.02 + underwaterBubbleHash(fi * 4.93) * 0.03;
        float squash = 1.0 + sin(iTime * 3.0 + fi) * 0.1;
        float2 bubblePos = float2(xBase + wobble, yPos);
        float2 toBubble = uv - bubblePos;
        toBubble.y *= squash;
        float dist = length(toBubble);
        if (dist < size * 1.5) {
            float bubbleMask = smoothstep(size, size * 0.8, dist);
            float nd = dist / size;
            float sz = sqrt(max(0.0, 1.0 - nd * nd));
            float2 refractUv = uv + toBubble * sz * 0.1;
            float3 refractedWater = mix(float3(0.0, 0.08, 0.15), float3(0.0, 0.2, 0.35), refractUv.y + 0.5);
            float highlight = pow(max(0.0, 1.0 - length(toBubble / size - float2(-0.3, 0.3)) * 1.5), 3.0);
            float rim = pow(nd, 6.0) * 0.4;
            float bottomLight = pow(max(0.0, 1.0 - length(toBubble / size - float2(0.1, -0.25)) * 2.0), 4.0) * 0.3;
            float3 bubbleColor = refractedWater * 1.2;
            bubbleColor += highlight * float3(0.7, 0.85, 1.0);
            bubbleColor += rim * float3(0.3, 0.5, 0.6);
            bubbleColor += bottomLight * float3(0.4, 0.6, 0.7);
            col = mix(col, bubbleColor, bubbleMask * 0.7);
        }
    }
    float vignette = 1.0 - 0.3 * length(uv);
    col *= vignette;
    return float4(col, 1.0);
}
