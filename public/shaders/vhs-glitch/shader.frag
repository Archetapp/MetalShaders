#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float vhsHash(float n) { return fract(sin(n) * 43758.5453); }
float vhsHash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float vhsNoise(float y, float t) {
    return vhsHash(floor(y * 20.0) + floor(t * 10.0));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 centered = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float trackingError = 0.0;
    float glitchLine = vhsNoise(uv.y, iTime);
    if (glitchLine > 0.95) {
        trackingError = (vhsHash(floor(iTime * 5.0) + floor(uv.y * 30.0)) - 0.5) * 0.1;
    }
    if (glitchLine > 0.98) {
        trackingError *= 3.0;
    }

    float scanJitter = sin(uv.y * 500.0 + iTime * 100.0) * 0.001;
    float bigGlitch = step(0.97, vhsHash(floor(iTime * 3.0))) * (vhsHash(floor(uv.y * 5.0 + iTime * 10.0)) - 0.5) * 0.05;

    vec2 uvR = uv + vec2(trackingError + scanJitter + bigGlitch + 0.003, 0.0);
    vec2 uvG = uv + vec2(trackingError + scanJitter + bigGlitch, 0.0);
    vec2 uvB = uv + vec2(trackingError + scanJitter + bigGlitch - 0.003, 0.0);

    float pattern = sin(centered.x * 8.0 + iTime) * sin(centered.y * 6.0 + iTime * 0.7);
    vec3 scene = 0.5 + 0.5 * cos(iTime + centered.xyx * 3.0 + vec3(0.0, 2.0, 4.0));
    scene *= 0.7 + 0.3 * pattern;

    float r = 0.5 + 0.5 * cos(iTime + (uvR - 0.5).x * 3.0);
    float g = 0.5 + 0.5 * cos(iTime + (uvG - 0.5).y * 3.0 + 2.0);
    float b = 0.5 + 0.5 * cos(iTime + (uvB - 0.5).x * 3.0 + 4.0);
    vec3 col = vec3(r, g, b);

    float scanline = sin(uv.y * iResolution.y * 3.14159) * 0.1;
    col -= scanline;

    float vignette = 1.0 - pow(length(centered) * 1.2, 2.5);
    col *= vignette;

    col *= 0.9 + 0.1 * vhsHash2(uv * iResolution.xy + iTime);

    float whiteNoise = vhsHash2(vec2(uv.y * 100.0, iTime * 50.0));
    if (whiteNoise > 0.993) {
        col = vec3(vhsHash2(uv + iTime));
    }

    col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))), 0.15);

    fragColor = vec4(col, 1.0);
}
