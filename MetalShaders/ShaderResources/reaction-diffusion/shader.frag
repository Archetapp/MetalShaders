#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.15;

    float feed = 0.037;
    float kill = 0.06;

    vec2 p = uv * 8.0;

    float n1 = fbm(p + t * 0.5);
    float n2 = fbm(p * 1.5 - t * 0.3 + n1 * 2.0);
    float n3 = fbm(p * 2.5 + n2 * 1.5 + t * 0.2);

    float a = n1;
    float b = smoothstep(0.35, 0.65, n2 + n3 * 0.5);

    float reaction = a * b * b;
    float pattern = b - reaction + feed * (1.0 - a);
    float pattern2 = reaction - b * (kill + feed);

    float v = smoothstep(0.2, 0.8, pattern * 2.0 + pattern2);

    float edge = abs(fwidth(v)) * 30.0;

    vec3 col1 = vec3(0.02, 0.05, 0.15);
    vec3 col2 = vec3(0.1, 0.3, 0.5);
    vec3 col3 = vec3(0.4, 0.7, 0.6);
    vec3 col4 = vec3(0.8, 0.9, 0.7);

    vec3 col;
    if (v < 0.33) {
        col = mix(col1, col2, v * 3.0);
    } else if (v < 0.66) {
        col = mix(col2, col3, (v - 0.33) * 3.0);
    } else {
        col = mix(col3, col4, (v - 0.66) * 3.0);
    }

    col += vec3(0.8, 0.9, 1.0) * edge * 0.3;

    float pulse = sin(t * 5.0 + v * 10.0) * 0.02;
    col += pulse;

    fragColor = vec4(col, 1.0);
}
