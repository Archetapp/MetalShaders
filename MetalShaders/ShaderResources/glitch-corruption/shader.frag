#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float gcHash(float n){return fract(sin(n)*43758.5453);}
float gcHash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;

    vec3 content = vec3(0.0);
    content.r = sin(uv.x * 20.0) * 0.5 + 0.5;
    content.g = sin(uv.y * 15.0 + 1.0) * 0.5 + 0.5;
    content.b = sin((uv.x + uv.y) * 12.0 + 2.0) * 0.5 + 0.5;
    content *= 0.5;

    float glitchTime = floor(iTime * 8.0);
    float glitchIntensity = pow(sin(iTime * 0.5) * 0.5 + 0.5, 2.0);

    float blockSize = 0.05 + gcHash(glitchTime) * 0.1;
    vec2 blockId = floor(uv / blockSize);
    float blockGlitch = step(0.7, gcHash2(blockId + glitchTime));
    blockGlitch *= glitchIntensity;

    float rgbSplit = blockGlitch * 0.03 + glitchIntensity * 0.01;
    vec3 col;
    col.r = sin((uv.x + rgbSplit) * 20.0) * 0.25 + 0.25;
    col.g = content.g;
    col.b = sin((uv.x - rgbSplit) * 20.0) * 0.25 + 0.25;

    float scanlineShift = gcHash(floor(uv.y * 50.0) + glitchTime) * glitchIntensity;
    float shiftAmount = (scanlineShift > 0.8 ? (scanlineShift - 0.8) * 5.0 : 0.0) * 0.1;
    col = mix(col, vec3(gcHash2(blockId + glitchTime + 1.0),
                        gcHash2(blockId + glitchTime + 2.0),
                        gcHash2(blockId + glitchTime + 3.0)), blockGlitch * 0.5);

    float scanError = step(0.95, gcHash(floor(uv.y * 100.0 + iTime * 50.0)));
    col = mix(col, vec3(1.0), scanError * glitchIntensity);

    float staticNoise = gcHash2(uv * 500.0 + iTime) * glitchIntensity * 0.15;
    col += staticNoise;

    float colorBand = step(0.9, gcHash(floor(uv.y * 30.0) + glitchTime * 0.5));
    col = mix(col, col.gbr, colorBand * glitchIntensity);

    float scanline = sin(uv.y * iResolution.y * 3.14159) * 0.03;
    col -= scanline;

    fragColor = vec4(col, 1.0);
}
