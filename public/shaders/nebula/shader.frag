#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float nebNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float nebFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * nebNoise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.02);

    float t = iTime * 0.05;
    float n1 = nebFbm(uv * 3.0 + t);
    float n2 = nebFbm(uv * 2.0 - t * 0.7 + 5.0);
    float n3 = nebFbm(uv * 4.0 + t * 0.3 + 10.0);

    vec3 layer1 = vec3(0.5, 0.1, 0.3) * pow(n1, 1.5) * 1.2;
    vec3 layer2 = vec3(0.1, 0.2, 0.6) * pow(n2, 1.5) * 1.0;
    vec3 layer3 = vec3(0.3, 0.05, 0.5) * pow(n3, 2.0) * 0.8;

    col += layer1 + layer2 + layer3;

    float dust = nebFbm(uv * 6.0 + t * 0.2);
    col *= 0.7 + 0.3 * dust;

    float emission = pow(nebFbm(uv * 5.0 + t * 0.5), 3.0);
    col += vec3(1.0, 0.4, 0.2) * emission * 0.4;

    for (int i = 0; i < 50; i++) {
        float fi = float(i);
        vec2 starPos = vec2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) - 0.5) * 1.2;
        float d = length(uv - starPos);
        float star = exp(-d * d * 5000.0);
        float twinkle = 0.6 + 0.4 * sin(iTime * 3.0 + fi * 7.0);
        col += star * twinkle * vec3(1.0, 0.95, 0.9);
    }

    fragColor = vec4(col, 1.0);
}
