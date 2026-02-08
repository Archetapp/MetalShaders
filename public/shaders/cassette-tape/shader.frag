#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.15, 0.12, 0.1);

    float caseW = 0.4, caseH = 0.25;
    float caseMask = step(abs(uv.x), caseW) * step(abs(uv.y), caseH);
    col = mix(col, vec3(0.2, 0.18, 0.15), caseMask);

    float border = step(abs(uv.x), caseW + 0.005) * step(abs(uv.y), caseH + 0.005) * (1.0 - caseMask);
    col = mix(col, vec3(0.3, 0.25, 0.2), border);

    vec2 reelL = vec2(-0.18, 0.05);
    vec2 reelR = vec2(0.18, 0.05);
    float reelSize = 0.1;
    float hubSize = 0.03;

    float reelLDist = length(uv - reelL);
    float reelRDist = length(uv - reelR);

    float reelLMask = smoothstep(reelSize + 0.003, reelSize - 0.003, reelLDist);
    float reelRMask = smoothstep(reelSize + 0.003, reelSize - 0.003, reelRDist);

    float reelLAngle = atan(uv.y - reelL.y, uv.x - reelL.x) + iTime * 3.0;
    float reelRAngle = atan(uv.y - reelR.y, uv.x - reelR.x) + iTime * 3.0;

    float spokeL = step(0.7, fract(reelLAngle / 6.28318 * 6.0));
    float spokeR = step(0.7, fract(reelRAngle / 6.28318 * 6.0));

    vec3 reelCol = vec3(0.25, 0.2, 0.18);
    reelCol -= spokeL * 0.05 * reelLMask;
    col = mix(col, reelCol, reelLMask);
    reelCol = vec3(0.25, 0.2, 0.18);
    reelCol -= spokeR * 0.05 * reelRMask;
    col = mix(col, reelCol, reelRMask);

    float hubL = smoothstep(hubSize + 0.002, hubSize - 0.002, reelLDist);
    float hubR = smoothstep(hubSize + 0.002, hubSize - 0.002, reelRDist);
    col = mix(col, vec3(0.5, 0.45, 0.4), max(hubL, hubR));

    float tapeY = 0.05;
    float tapeH = 0.008;
    float tapeMask = step(abs(uv.y - tapeY), tapeH) *
                     step(reelL.x + reelSize, uv.x) * step(uv.x, reelR.x - reelSize);
    col = mix(col, vec3(0.15, 0.08, 0.05), tapeMask);

    float tapeMotion = sin(uv.x * 100.0 - iTime * 20.0) * 0.5 + 0.5;
    col += tapeMask * vec3(0.03) * tapeMotion;

    float windowW = 0.25, windowH = 0.06;
    float windowY = 0.05;
    float window = step(abs(uv.x), windowW) * step(abs(uv.y - windowY), windowH);
    float windowBorder = step(abs(uv.x), windowW + 0.005) * step(abs(uv.y - windowY), windowH + 0.005) * (1.0 - window);
    col = mix(col, vec3(0.08, 0.06, 0.05), windowBorder * caseMask);

    float labelY = -0.1;
    float labelH = 0.08;
    float label = step(abs(uv.x), 0.3) * step(abs(uv.y - labelY), labelH) * caseMask;
    col = mix(col, vec3(0.85, 0.82, 0.75), label);

    float labelLine = step(abs(fract((uv.y - labelY + labelH) * 20.0) - 0.5), 0.45) * label;
    col -= vec3(0.05) * labelLine;

    fragColor = vec4(col, 1.0);
}
