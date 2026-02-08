#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float iwsHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float iwsNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(iwsHash(i), iwsHash(i + vec2(1,0)), f.x),
               mix(iwsHash(i + vec2(0,1)), iwsHash(i + vec2(1,1)), f.x), f.y);
}
float iwsFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * iwsNoise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float paperGrain = iwsFbm(uv * 40.0) * 0.08;
    vec3 paperColor = vec3(0.95, 0.93, 0.88) - paperGrain;

    float ink = 0.0;
    vec3 inkColor = vec3(0.0);

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 dropPos = vec2(sin(fi * 2.3 + 0.5) * 0.25, cos(fi * 1.8 + 1.0) * 0.2);
        float dropTime = max(0.0, iTime * 0.3 - fi * 0.8);

        float baseRadius = dropTime * 0.12;
        float noiseDistort = iwsFbm(uv * 8.0 + fi * 10.0 + iTime * 0.02) * 0.15;
        float grainFollow = iwsFbm(uv * 20.0 + fi * 5.0) * 0.08;

        float dist = length(uv - dropPos);
        float dropMask = smoothstep(baseRadius + noiseDistort + grainFollow,
                                    baseRadius * 0.5, dist);

        float edgeDarken = smoothstep(baseRadius * 0.3, baseRadius + noiseDistort, dist);
        float concentrate = 0.3 + 0.7 * edgeDarken;

        vec3 colors[4];
        colors[0] = vec3(0.1, 0.1, 0.3);
        colors[1] = vec3(0.6, 0.1, 0.15);
        colors[2] = vec3(0.05, 0.2, 0.1);
        colors[3] = vec3(0.4, 0.2, 0.05);

        float blend = dropMask * concentrate;
        ink += blend;
        inkColor += colors[i] * blend;
    }

    ink = clamp(ink, 0.0, 1.0);
    inkColor = ink > 0.001 ? inkColor / ink : vec3(0.0);

    float bleed = iwsFbm(uv * 15.0 + iTime * 0.01) * 0.3;
    float wetEdge = smoothstep(0.8, 1.0, ink) * bleed;

    vec3 col = mix(paperColor, inkColor, ink * 0.8);
    col -= wetEdge * 0.1;

    float paperTexture = iwsNoise(uv * 100.0) * 0.03;
    col += paperTexture * (1.0 - ink * 0.5);

    fragColor = vec4(col, 1.0);
}
