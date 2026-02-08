#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dtHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float dtNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(dtHash(i), dtHash(i + vec2(1.0, 0.0)), f.x),
               mix(dtHash(i + vec2(0.0, 1.0)), dtHash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float dtFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
        v += a * dtNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

vec3 dtPattern1(vec2 uv, float t) {
    float angle = atan(uv.y, uv.x);
    float r = length(uv);
    float spiral = sin(angle * 5.0 + r * 10.0 - t * 3.0);
    vec3 col = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + spiral * 3.0 + t);
    col *= 0.8 + 0.2 * sin(r * 20.0 - t * 2.0);
    return col;
}

vec3 dtPattern2(vec2 uv, float t) {
    vec2 grid = fract(uv * 5.0) - 0.5;
    vec2 id = floor(uv * 5.0);
    float d = length(grid);
    float phase = dtHash(id) * 6.28 + t * 2.0;
    float size = 0.3 + 0.15 * sin(phase);
    float shape = smoothstep(size, size - 0.05, d);
    vec3 col = 0.5 + 0.5 * cos(vec3(2.0, 4.0, 6.0) + dtHash(id + 42.0) * 6.0 + t);
    return col * shape + vec3(0.05) * (1.0 - shape);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float progress = sin(t * 0.5) * 0.5 + 0.5;

    float noise = dtFbm(uv * 4.0);
    float noise2 = dtFbm(uv * 8.0 + 100.0);
    float combinedNoise = noise * 0.7 + noise2 * 0.3;

    float threshold = progress;

    float dissolve = smoothstep(threshold - 0.01, threshold + 0.01, combinedNoise);

    vec3 col1 = dtPattern1(uv, t);
    vec3 col2 = dtPattern2(uv, t);

    vec3 col = mix(col1, col2, dissolve);

    float edgeDist = abs(combinedNoise - threshold);
    float edgeWidth = 0.04;
    float edge = smoothstep(edgeWidth, 0.0, edgeDist);

    vec3 edgeColor1 = vec3(1.0, 0.8, 0.2);
    vec3 edgeColor2 = vec3(1.0, 0.3, 0.1);
    vec3 edgeColor = mix(edgeColor1, edgeColor2, sin(t * 3.0 + combinedNoise * 10.0) * 0.5 + 0.5);

    col += edgeColor * edge * 2.0;
    col += edgeColor * exp(-edgeDist * 30.0) * 0.5;

    float innerEdge = smoothstep(edgeWidth * 0.5, 0.0, edgeDist);
    col += vec3(1.0, 1.0, 0.9) * innerEdge * 1.5;

    float vig = 1.0 - 0.25 * dot(uv, uv);
    col *= vig;

    col = col / (col + 0.7);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
