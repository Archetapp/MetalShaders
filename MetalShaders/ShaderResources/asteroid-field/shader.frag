#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float astHash(float n) { return fract(sin(n) * 43758.5453); }

float asteroidSDF(vec2 p, float seed) {
    float a = atan(p.y, p.x);
    float r = length(p);
    float bumps = 1.0 + 0.3 * sin(a * 5.0 + seed * 10.0) + 0.15 * sin(a * 8.0 + seed * 20.0);
    return r - 0.04 * bumps;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.015);

    for (int i = 0; i < 40; i++) {
        float fi = float(i);
        float seed = astHash(fi * 13.37);
        float depth = astHash(fi * 7.71);
        float size = 0.02 + astHash(fi * 3.31) * 0.04;
        size *= (0.3 + depth * 0.7);

        float speed = 0.1 + depth * 0.2;
        float x = mod(astHash(fi * 17.13) + iTime * speed * (astHash(fi * 5.5) - 0.5), 1.4) - 0.7;
        float y = mod(astHash(fi * 23.17) + iTime * speed * 0.3 * (astHash(fi * 9.1) - 0.5), 1.0) - 0.5;
        vec2 pos = vec2(x, y);

        float rotation = iTime * (0.5 + astHash(fi * 11.3) * 2.0);
        float c = cos(rotation), s = sin(rotation);
        vec2 localUV = uv - pos;
        localUV = vec2(c * localUV.x - s * localUV.y, s * localUV.x + c * localUV.y);
        localUV /= size;

        float d = asteroidSDF(localUV, seed);
        float astMask = smoothstep(0.02, -0.02, d);

        vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
        float nx = asteroidSDF(localUV + vec2(0.01, 0.0), seed) - d;
        float ny = asteroidSDF(localUV + vec2(0.0, 0.01), seed) - d;
        vec3 normal = normalize(vec3(-nx, -ny, 0.02));
        float lighting = max(dot(normal, lightDir), 0.0);

        vec3 astCol = mix(vec3(0.25, 0.22, 0.18), vec3(0.45, 0.4, 0.35), astHash(fi * 31.1));
        astCol *= 0.3 + 0.7 * lighting;
        astCol *= (0.5 + depth * 0.5);

        col = mix(col, astCol, astMask);
    }

    for (int i = 0; i < 30; i++) {
        float fi = float(i);
        vec2 sp = vec2(astHash(fi * 73.1 + 100.0) - 0.5, astHash(fi * 91.3 + 100.0) - 0.5);
        col += exp(-length(uv - sp) * length(uv - sp) * 5000.0) * vec3(0.6, 0.65, 0.8) * 0.3;
    }

    fragColor = vec4(col, 1.0);
}
