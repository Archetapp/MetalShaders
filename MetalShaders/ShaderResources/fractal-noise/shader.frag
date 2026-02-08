#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.3;

    float n1 = fbm(uv * 4.0 + vec2(t, 0.0));
    float n2 = fbm(uv * 4.0 + vec2(0.0, t * 0.7) + n1 * 2.0);
    float n3 = fbm(uv * 4.0 + n2 * 1.5);

    vec3 col1 = vec3(0.1, 0.2, 0.4);
    vec3 col2 = vec3(0.8, 0.4, 0.1);
    vec3 col3 = vec3(0.95, 0.9, 0.8);

    vec3 col = mix(col1, col2, n2);
    col = mix(col, col3, smoothstep(0.5, 0.8, n3));

    fragColor = vec4(col, 1.0);
}
