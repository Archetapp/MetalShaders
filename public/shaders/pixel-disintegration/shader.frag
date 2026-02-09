#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float pdHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    float progress = smoothstep(0.0, 1.5, iMouseTime * 0.25);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

    float pixelSize = 0.015;
    vec2 pixelId = floor(uv / pixelSize);
    vec2 pixelCenter = (pixelId + 0.5) * pixelSize;

    float sweepDir = hasInput ? -length(pixelCenter - mouseCentered) * 2.0 : pixelCenter.x + pixelCenter.y * 0.3;
    float threshold = pdHash(pixelId) * 0.5;
    float dissolveT = smoothstep(threshold, threshold + 0.3, progress + sweepDir * 0.3);

    float checker = mod(pixelId.x + pixelId.y, 2.0);
    vec3 contentColor = mix(vec3(0.2, 0.4, 0.7), vec3(0.7, 0.5, 0.3), checker);
    float circle = smoothstep(0.25, 0.23, length(pixelCenter));
    contentColor = mix(contentColor, vec3(0.8, 0.3, 0.2), circle);

    vec2 windDir = vec2(1.0, -0.5);
    float flyTime = max(0.0, dissolveT);
    vec2 flyOffset = windDir * flyTime * 0.3 * (1.0 + pdHash(pixelId + 100.0));
    flyOffset.y += flyTime * flyTime * 0.1;
    float alpha = 1.0 - dissolveT;
    float fadeOut = smoothstep(1.0, 0.5, dissolveT);

    vec3 col = vec3(0.02, 0.02, 0.03);

    if (dissolveT < 0.01) {
        float pixelMask = step(abs(fract(uv.x / pixelSize) - 0.5), 0.45) *
                          step(abs(fract(uv.y / pixelSize) - 0.5), 0.45);
        col = contentColor * pixelMask;
    } else if (dissolveT < 1.0) {
        vec2 flyPos = pixelCenter + flyOffset;
        float flyDist = length(uv - flyPos);
        float flyPixel = smoothstep(pixelSize * 0.5, pixelSize * 0.3, flyDist);
        col = contentColor * flyPixel * fadeOut;
        col += flyPixel * fadeOut * vec3(0.3, 0.2, 0.1) * (1.0 - fadeOut);
    }

    fragColor = vec4(col, 1.0);
}
