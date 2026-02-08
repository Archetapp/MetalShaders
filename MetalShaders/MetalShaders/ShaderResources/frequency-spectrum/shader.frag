#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fsHash(float n){return fract(sin(n)*43758.5453);}

float fsFreqBin(float bin, float t) {
    float bass = sin(t * 2.0 + bin * 0.5) * 0.5 + 0.5;
    float mid = sin(t * 4.0 + bin * 2.0) * 0.3 + 0.4;
    float treble = sin(t * 8.0 + bin * 5.0) * 0.2 + 0.3;
    float noise = fsHash(bin + floor(t * 4.0)) * 0.2;

    float weight = bin < 5.0 ? bass : bin < 15.0 ? mid : treble;
    return weight + noise * (1.0 - weight * 0.5);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec3 col = vec3(0.02, 0.02, 0.04);

    float numBars = 32.0;
    float barIndex = floor(uv.x * numBars);
    float barLocal = fract(uv.x * numBars);
    float barGap = smoothstep(0.0, 0.1, barLocal) * smoothstep(1.0, 0.9, barLocal);

    float barHeight = fsFreqBin(barIndex, iTime);
    barHeight = pow(barHeight, 1.5);

    float barMask = step(uv.y, barHeight) * barGap;

    float t = barIndex / numBars;
    vec3 barColor;
    if (t < 0.33) barColor = mix(vec3(0.8, 0.1, 0.2), vec3(0.9, 0.5, 0.1), t * 3.0);
    else if (t < 0.66) barColor = mix(vec3(0.9, 0.5, 0.1), vec3(0.2, 0.8, 0.3), (t - 0.33) * 3.0);
    else barColor = mix(vec3(0.2, 0.8, 0.3), vec3(0.2, 0.4, 0.9), (t - 0.66) * 3.0);

    float peak = smoothstep(barHeight - 0.02, barHeight, uv.y) * step(uv.y, barHeight + 0.01);
    float glow = exp(-abs(uv.y - barHeight) * 20.0) * barGap * 0.3;

    col += barColor * barMask * 0.8;
    col += barColor * peak * 1.5;
    col += barColor * glow;

    float reflection = step(uv.y, 0.0) * 0.0;
    float reflUv = -uv.y;
    float reflBar = step(reflUv, barHeight * 0.3) * barGap;

    float scanline = sin(uv.y * iResolution.y * 1.5) * 0.02;
    col -= scanline;

    fragColor = vec4(col, 1.0);
}
