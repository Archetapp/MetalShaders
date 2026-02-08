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
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.3;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float segments = 6.0;
    float segAngle = 3.14159 * 2.0 / segments;
    a = mod(a, segAngle);
    if (a > segAngle * 0.5) a = segAngle - a;

    vec2 p = vec2(cos(a), sin(a)) * r;

    p += t * 0.3;

    float n1 = fbm(p * 3.0 + t * 0.5);
    float n2 = fbm(p * 5.0 - t * 0.3 + n1 * 2.0);
    float n3 = fbm(p * 8.0 + n2 * 1.5);

    float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    vec3 col;
    col.r = sin(pattern * 6.0 + t + 0.0) * 0.5 + 0.5;
    col.g = sin(pattern * 6.0 + t + 2.1) * 0.5 + 0.5;
    col.b = sin(pattern * 6.0 + t + 4.2) * 0.5 + 0.5;

    col *= 0.6 + 0.4 * sin(r * 8.0 - t * 2.0);

    float vignette = 1.0 - r * 0.8;
    col *= max(vignette, 0.0);

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
