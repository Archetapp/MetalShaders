#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float hmtHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hmtNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hmtHash(i), hmtHash(i + vec2(1, 0)), f.x),
               mix(hmtHash(i + vec2(0, 1)), hmtHash(i + vec2(1, 1)), f.x), f.y);
}

vec3 hmtThermalPalette(float t) {
    if (t < 0.25) return mix(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 1.0), t * 4.0);
    if (t < 0.5) return mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), (t - 0.25) * 4.0);
    if (t < 0.75) return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.5) * 4.0);
    return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.75) * 4.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float heat = 0.0;

    for (int i = 0; i < 6; i++) {
        float t = iTime * 0.4 + float(i) * 1.5;
        float phase = floor(t / 3.0);
        float localT = fract(t / 3.0) * 3.0;

        vec2 touchPos = vec2(
            sin(phase * 2.1 + float(i)) * 0.3,
            cos(phase * 1.7 + float(i) * 0.5) * 0.3
        );

        float age = localT;
        float radius = 0.05 + age * 0.08;
        float intensity = max(0.0, 1.0 - age * 0.35);

        float dist = length(uv - touchPos);
        float heatContrib = exp(-dist * dist / (radius * radius)) * intensity;

        heat += heatContrib;
    }

    float noiseVal = hmtNoise(uv * 8.0 + iTime * 0.1) * 0.1;
    heat += noiseVal * 0.3;

    float ambientHeat = 0.15 + 0.05 * sin(uv.x * 3.0 + iTime * 0.2) +
                        0.05 * sin(uv.y * 2.5 - iTime * 0.15);
    heat += ambientHeat;

    heat = clamp(heat, 0.0, 1.0);

    vec3 col = hmtThermalPalette(heat);

    float scanline = sin(gl_FragCoord.y * 2.0) * 0.03;
    col += scanline;

    float noiseGrain = (hmtHash(uv * 500.0 + iTime) - 0.5) * 0.04;
    col += noiseGrain;

    float vignette = 1.0 - 0.3 * length(uv);
    col *= vignette;

    fragColor = vec4(col, 1.0);
}
