#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float galaxyNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = dot(i, vec2(127.1, 311.7));
    return mix(mix(fract(sin(n) * 43758.5453), fract(sin(n + 127.1) * 43758.5453), f.x),
               mix(fract(sin(n + 311.7) * 43758.5453), fract(sin(n + 438.8) * 43758.5453), f.x), f.y);
}

float galaxyFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * galaxyNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.015);

    float r = length(uv);
    float a = atan(uv.y, uv.x) + iTime * 0.1;

    float arms = 2.0;
    float twist = 3.0;
    float spiral = sin(a * arms - r * twist * 6.2832 + galaxyFbm(uv * 3.0) * 2.0);
    spiral = pow(max(spiral, 0.0), 2.0);

    float diskMask = exp(-r * 3.0);
    float armBrightness = spiral * diskMask;

    vec3 armCol = mix(vec3(0.3, 0.4, 0.8), vec3(0.8, 0.6, 0.9), r * 2.0);
    col += armCol * armBrightness * 0.6;

    float dust = galaxyFbm(uv * 8.0 + iTime * 0.05);
    col *= 1.0 - dust * 0.3 * diskMask;

    float core = exp(-r * r * 80.0);
    col += vec3(1.0, 0.9, 0.7) * core;
    col += vec3(0.8, 0.7, 0.5) * exp(-r * r * 20.0) * 0.5;

    for (int i = 0; i < 80; i++) {
        float fi = float(i);
        float starAngle = fract(sin(fi * 73.13) * 43758.5453) * 6.2832;
        float starR = fract(sin(fi * 31.71) * 43758.5453) * 0.45;
        vec2 starPos = vec2(cos(starAngle), sin(starAngle)) * starR;
        float starD = length(uv - starPos);
        float star = exp(-starD * starD * 8000.0);
        float twinkle = 0.7 + 0.3 * sin(iTime * 2.0 + fi * 5.0);
        col += star * vec3(0.8, 0.85, 1.0) * twinkle;
    }

    fragColor = vec4(col, 1.0);
}
