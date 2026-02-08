#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float termHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float termChar(vec2 p, float seed) {
    vec2 grid = floor(p * vec2(4.0, 6.0));
    float filled = step(0.4, termHash(grid + seed * 100.0));
    return filled * step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 cuv = uv * 2.0 - 1.0;
    cuv *= 1.0 + 0.03 * length(cuv * cuv);
    uv = cuv * 0.5 + 0.5;

    vec3 col = vec3(0.0, 0.02, 0.0);

    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
        float charW = 10.0;
        float charH = 16.0;
        float cols = floor(iResolution.x / charW);
        float rows = floor(iResolution.y / charH);

        vec2 charPos = floor(uv * vec2(cols, rows));
        vec2 charUV = fract(uv * vec2(cols, rows));

        float lineIdx = rows - 1.0 - charPos.y;
        float typing = iTime * 15.0;
        float charIdx = charPos.x + lineIdx * cols;

        float visible = step(charIdx, typing);
        float seed = termHash(charPos + floor(charIdx / cols));

        float ch = termChar(charUV, seed) * visible;

        float cursorX = mod(typing, cols);
        float cursorY = rows - 1.0 - floor(typing / cols);
        float cursor = step(abs(charPos.x - cursorX), 0.5) * step(abs(charPos.y - cursorY), 0.5);
        float cursorBlink = step(0.5, fract(iTime * 2.0));
        ch = max(ch, cursor * cursorBlink);

        col += vec3(0.0, 0.8, 0.0) * ch;
        col += vec3(0.0, 0.15, 0.0) * visible * 0.1;
    }

    float scanline = sin(gl_FragCoord.y * 1.5) * 0.08;
    col -= scanline;

    float flicker = 0.97 + 0.03 * sin(iTime * 8.0);
    col *= flicker;

    col += vec3(0.0, 0.05, 0.0) * exp(-length(cuv) * 1.5);

    float vignette = 1.0 - 0.5 * length(cuv);
    col *= vignette;

    fragColor = vec4(col, 1.0);
}
