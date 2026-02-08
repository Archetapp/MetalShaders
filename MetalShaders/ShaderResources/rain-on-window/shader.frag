#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rainHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float rainHash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float rainNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 157.0;
    return mix(mix(rainHash(n), rainHash(n + 1.0), f.x),
               mix(rainHash(n + 157.0), rainHash(n + 158.0), f.x), f.y);
}

vec2 rainDrop(vec2 uv, float t, float id) {
    float speed = 0.3 + rainHash(id * 13.7) * 0.4;
    float xWobble = sin(t * (1.0 + rainHash(id * 7.3)) + id * 6.28) * 0.01;

    float cellY = fract(uv.y * 0.5 + t * speed + rainHash(id) * 100.0);
    float cellX = uv.x + xWobble;

    float dropX = rainHash(id * 3.14 + floor(uv.y * 0.5 + t * speed + rainHash(id) * 100.0)) * 0.8 + 0.1;
    float dx = cellX - dropX;
    float dy = cellY - 0.5;

    float dropSize = 0.02 + rainHash(id * 5.7) * 0.015;
    float drop = smoothstep(dropSize, dropSize * 0.3, length(vec2(dx, dy * 2.0)));

    float trail = smoothstep(0.008, 0.0, abs(dx)) * smoothstep(0.5, 0.8, cellY) * 0.5;
    float trailDroplets = smoothstep(0.006, 0.0, abs(dx)) * step(0.7, rainHash2(vec2(floor(cellY * 20.0), id)));
    trail += trailDroplets * 0.3;

    float distortion = (drop + trail * 0.5) * 0.05;
    vec2 normal = vec2(dx, dy) * drop * 3.0;

    return normal * distortion * 10.0;
}

vec3 rainBackground(vec2 uv, float t) {
    vec3 col1 = vec3(0.15, 0.18, 0.25);
    vec3 col2 = vec3(0.08, 0.1, 0.15);
    vec3 col3 = vec3(0.2, 0.15, 0.1);

    float n = rainNoise(uv * 3.0 + t * 0.02);
    vec3 bg = mix(col1, col2, uv.y);
    bg = mix(bg, col3, n * 0.3);

    float light1 = exp(-length(uv - vec2(0.3, 0.7)) * 3.0) * 0.4;
    float light2 = exp(-length(uv - vec2(0.7, 0.6)) * 4.0) * 0.3;
    bg += vec3(1.0, 0.9, 0.7) * light1;
    bg += vec3(0.7, 0.8, 1.0) * light2;

    float light3 = exp(-length(uv - vec2(0.5, 0.4)) * 2.5) * 0.2;
    bg += vec3(1.0, 0.6, 0.3) * light3;

    return bg;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;

    vec2 totalRefraction = vec2(0.0);

    for (int layer = 0; layer < 3; layer++) {
        float layerScale = 1.0 + float(layer) * 0.5;
        float layerId = float(layer) * 100.0;
        vec2 layerUv = uv * vec2(aspect * layerScale, layerScale);

        for (int i = 0; i < 8; i++) {
            float id = layerId + float(i);
            vec2 cellUv = layerUv;
            cellUv.x += rainHash(id) * 2.0;
            totalRefraction += rainDrop(cellUv, iTime, id) * (1.0 / layerScale);
        }
    }

    vec2 refractedUv = uv + totalRefraction;
    vec3 bg = rainBackground(refractedUv, iTime);

    float dropMask = length(totalRefraction) * 20.0;
    bg += vec3(0.15, 0.2, 0.25) * dropMask;

    float fogAmount = 0.15;
    vec3 fogColor = vec3(0.12, 0.14, 0.18);
    bg = mix(bg, fogColor, fogAmount);

    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    vignette = smoothstep(0.0, 1.0, vignette);
    bg *= vignette;

    fragColor = vec4(bg, 1.0);
}
