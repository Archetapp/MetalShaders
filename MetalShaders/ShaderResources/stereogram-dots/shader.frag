#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float stereoHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float stereoDepthMap(vec2 p) {
    float shape = smoothstep(0.2, 0.15, length(p));
    float star = 0.0;
    float a = atan(p.y, p.x);
    float r = length(p);
    float starShape = 0.12 + 0.05 * cos(a * 5.0 + iTime);
    star = smoothstep(starShape + 0.01, starShape - 0.01, r);
    return star * 0.3;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 centered = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float patternWidth = 0.12;
    float depth = stereoDepthMap(centered);
    float shift = depth * patternWidth;

    float repeatedX = mod(uv.x + shift, patternWidth);
    vec2 cell = vec2(repeatedX, uv.y);

    float pixelSize = 3.0 / iResolution.y;
    vec2 quantized = floor(cell / pixelSize) * pixelSize;

    float r = stereoHash(quantized);
    float g = stereoHash(quantized + 17.31);
    float b = stereoHash(quantized + 31.17);

    vec3 col = vec3(r, g, b);
    col = mix(col, col * col, 0.3);

    float scan = sin(gl_FragCoord.y * 2.0) * 0.02;
    col += scan;

    fragColor = vec4(col, 1.0);
}
