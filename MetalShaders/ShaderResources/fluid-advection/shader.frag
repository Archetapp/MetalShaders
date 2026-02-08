#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 faHash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float faNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(dot(faHash3(i + vec3(0, 0, 0)), f - vec3(0, 0, 0)),
                       dot(faHash3(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), u.x),
                   mix(dot(faHash3(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)),
                       dot(faHash3(i + vec3(1, 1, 0)), f - vec3(1, 1, 0)), u.x), u.y),
               mix(mix(dot(faHash3(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)),
                       dot(faHash3(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), u.x),
                   mix(dot(faHash3(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)),
                       dot(faHash3(i + vec3(1, 1, 1)), f - vec3(1, 1, 1)), u.x), u.y), u.z);
}

float faFbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 5; i++) {
        v += a * faNoise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

vec2 faCurlNoise(vec2 p, float t) {
    float eps = 0.01;
    float n1 = faFbm(vec3(p.x, p.y + eps, t));
    float n2 = faFbm(vec3(p.x, p.y - eps, t));
    float n3 = faFbm(vec3(p.x + eps, p.y, t));
    float n4 = faFbm(vec3(p.x - eps, p.y, t));
    return vec2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

vec3 faColorPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.15;

    vec2 p = uv * 2.0;

    vec2 advected = p;
    for (int i = 0; i < 6; i++) {
        vec2 curl = faCurlNoise(advected * 0.8, t + float(i) * 0.1);
        advected += curl * 0.15;
    }

    float n1 = faFbm(vec3(advected * 1.5, t));
    float n2 = faFbm(vec3(advected * 1.5 + 5.0, t + 10.0));
    float n3 = faFbm(vec3(advected * 1.5 + 10.0, t + 20.0));

    vec2 warp = vec2(n1, n2) * 2.0;
    float pattern = faFbm(vec3(advected + warp, t));
    float pattern2 = faFbm(vec3(advected * 2.0 + warp * 0.5, t * 1.3));

    vec3 col1 = faColorPalette(pattern * 0.5 + t * 0.2);
    vec3 col2 = faColorPalette(pattern2 * 0.5 + t * 0.3 + 0.5);
    vec3 col3 = faColorPalette(n3 * 0.7 + t * 0.1 + 0.3);

    vec3 col = mix(col1, col2, smoothstep(-0.2, 0.2, pattern));
    col = mix(col, col3, smoothstep(-0.1, 0.3, pattern2) * 0.5);

    float edge = length(faCurlNoise(advected, t)) * 2.0;
    col += vec3(0.2, 0.1, 0.3) * edge;

    col *= 0.8 + 0.2 * pattern;
    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.25 * length(uv);

    fragColor = vec4(col, 1.0);
}
