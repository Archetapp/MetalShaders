#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float iwHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float iwNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = iwHash(i);
    float b = iwHash(i + vec2(1.0, 0.0));
    float c = iwHash(i + vec2(0.0, 1.0));
    float d = iwHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float iwFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 7; i++) {
        v += a * iwNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float iwInkDrop(vec2 uv, vec2 center, float t, float startTime, float seed) {
    float elapsed = max(0.0, t - startTime);
    float spread = elapsed * 0.15;
    spread = spread / (1.0 + spread * 2.0);

    vec2 diff = uv - center;
    float angle = atan(diff.y, diff.x);

    float noiseOffset = iwFbm(uv * 8.0 + seed * 5.0 + elapsed * 0.3) * 0.15;
    noiseOffset += iwFbm(uv * 15.0 + seed * 10.0) * 0.08;

    float fingerNoise = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
        float a = i * 0.785 + seed * 6.28;
        float strength = iwHash(vec2(seed, i)) * 0.08;
        fingerNoise += strength * exp(-pow(mod(angle - a, 6.28) - 3.14, 2.0) * 3.0);
    }

    float radius = spread + noiseOffset + fingerNoise;
    float dist = length(diff);

    float edge = smoothstep(radius + 0.01, radius - 0.02, dist);

    float concentration = edge * (1.0 - smoothstep(0.0, radius * 0.8, dist) * 0.6);
    concentration *= smoothstep(0.0, 0.5, elapsed);

    float edgeBleed = smoothstep(radius - 0.04, radius, dist) * edge;
    concentration += edgeBleed * 0.3;

    return concentration;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime;

    float paperNoise = iwFbm(uv * 20.0) * 0.08;
    float paperGrain = iwNoise(uv * 100.0) * 0.03;
    vec3 paperColor = vec3(0.95, 0.93, 0.88) - paperNoise - paperGrain;

    float fiberX = sin(uv.x * 200.0 + iwNoise(uv * 50.0) * 5.0) * 0.005;
    float fiberY = sin(uv.y * 200.0 + iwNoise(uv * 50.0 + 7.0) * 5.0) * 0.005;
    paperColor -= (fiberX + fiberY) * 0.5;

    vec3 inkColors[5];
    inkColors[0] = vec3(0.1, 0.1, 0.35);
    inkColors[1] = vec3(0.6, 0.1, 0.15);
    inkColors[2] = vec3(0.1, 0.3, 0.15);
    inkColors[3] = vec3(0.4, 0.15, 0.5);
    inkColors[4] = vec3(0.05, 0.05, 0.08);

    vec2 dropCenters[5];
    dropCenters[0] = vec2(-0.15, 0.1);
    dropCenters[1] = vec2(0.2, -0.05);
    dropCenters[2] = vec2(-0.05, -0.2);
    dropCenters[3] = vec2(0.25, 0.2);
    dropCenters[4] = vec2(-0.25, -0.1);

    float startTimes[5];
    startTimes[0] = 0.0;
    startTimes[1] = 1.5;
    startTimes[2] = 3.0;
    startTimes[3] = 4.5;
    startTimes[4] = 6.0;

    vec3 col = paperColor;

    for (int i = 0; i < 5; i++) {
        float ink = iwInkDrop(uv, dropCenters[i], mod(t, 12.0), startTimes[i], float(i));

        float wetness = iwFbm(uv * 12.0 + float(i) * 3.0 + t * 0.1) * ink;
        float pigmentVariation = iwFbm(uv * 25.0 + float(i) * 7.0) * 0.3 + 0.7;

        vec3 inkCol = inkColors[i] * pigmentVariation;

        float edgeDarken = smoothstep(0.3, 0.0, ink) * ink * 0.3;
        inkCol *= (1.0 + edgeDarken);

        float bleedAmount = iwFbm(uv * 8.0 + float(i) + t * 0.05) * 0.15;
        vec3 bleedColor = inkCol * 0.3;

        float paperAbsorb = (1.0 - paperNoise * 2.0);
        ink *= paperAbsorb;

        col = mix(col, inkCol, ink * 0.85);
        col = mix(col, bleedColor, wetness * 0.2);
    }

    float watermark = iwFbm(uv * 4.0 + t * 0.02) * 0.02;
    col += watermark;

    col = pow(col, vec3(0.97));

    fragColor = vec4(col, 1.0);
}
