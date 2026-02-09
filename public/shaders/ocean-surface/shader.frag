#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float oceanHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float oceanNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = oceanHash(i);
    float b = oceanHash(i + vec2(1.0, 0.0));
    float c = oceanHash(i + vec2(0.0, 1.0));
    float d = oceanHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float oceanWaves(vec2 p, float t) {
    float wave = 0.0;
    float freq = 1.0;
    float amp = 0.5;
    vec2 dir;
    for (int i = 0; i < 6; i++) {
        float angle = float(i) * 0.9 + 0.3;
        dir = vec2(cos(angle), sin(angle));
        float phase = dot(p, dir) * freq - t * (1.0 + float(i) * 0.2);
        wave += sin(phase) * amp;
        wave += sin(phase * 1.3 + t * 0.5) * amp * 0.3;
        freq *= 1.7;
        amp *= 0.5;
    }
    return wave;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.8;

    float horizon = 0.4;

    if (uv.y > horizon + 0.01) {
        float skyT = (uv.y - horizon) / (1.0 - horizon);
        vec3 skyLow = vec3(0.8, 0.55, 0.4);
        vec3 skyHigh = vec3(0.2, 0.35, 0.65);
        vec3 sky = mix(skyLow, skyHigh, skyT);

        vec2 sunPos = vec2(0.5, horizon + 0.05);
        float sunDist = length(uv - sunPos);
        sky += vec3(1.0, 0.7, 0.3) * exp(-sunDist * 8.0) * 0.6;

        fragColor = vec4(sky, 1.0);
        return;
    }

    float depth = max(0.001, horizon - uv.y);
    float perspScale = 1.0 / depth;
    vec2 worldPos = vec2((uv.x - 0.5) * perspScale * 2.0, perspScale * 0.5);

    float wave = oceanWaves(worldPos * 0.3, t);
    float waveDetail = oceanNoise(worldPos * 3.0 + t * 0.3) * 0.1;
    wave += waveDetail;

    float nx = oceanWaves((worldPos + vec2(0.01, 0.0)) * 0.3, t) - wave;
    float ny = oceanWaves((worldPos + vec2(0.0, 0.01)) * 0.3, t) - wave;
    vec3 normal = normalize(vec3(-nx * 30.0, 1.0, -ny * 30.0));

    vec3 viewDir = normalize(vec3(uv.x - 0.5, 0.3, -1.0));
    float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0), 3.0);
    fresnel = mix(0.1, 1.0, fresnel);

    vec3 deepColor = vec3(0.0, 0.05, 0.15);
    vec3 shallowColor = vec3(0.0, 0.25, 0.35);
    vec3 waterColor = mix(deepColor, shallowColor, clamp(wave * 0.5 + 0.5, 0.0, 1.0));

    vec3 skyReflect = vec3(0.4, 0.5, 0.7);
    vec3 col = mix(waterColor, skyReflect, fresnel);

    vec3 sunDir = normalize(vec3(0.0, 0.3, -1.0));
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 120.0);
    col += vec3(1.0, 0.85, 0.6) * spec * 2.0;

    float foam = smoothstep(0.35, 0.5, wave + waveDetail * 2.0);
    col = mix(col, vec3(0.9, 0.95, 1.0), foam * 0.4);

    float depthFade = smoothstep(0.0, 0.15, depth);
    col = mix(vec3(0.8, 0.55, 0.4), col, depthFade);

    fragColor = vec4(col, 1.0);
}
