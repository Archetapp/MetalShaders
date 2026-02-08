#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float tswHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

    vec3 bgPattern = vec3(0.0);
    float grid = smoothstep(0.01, 0.0, abs(fract(uv.x * 8.0) - 0.5) - 0.48) +
                 smoothstep(0.01, 0.0, abs(fract(uv.y * 8.0) - 0.5) - 0.48);
    bgPattern = vec3(0.05, 0.08, 0.12) + grid * vec3(0.02, 0.04, 0.06);

    vec2 distortedUv = uv;
    vec3 waveColor = vec3(0.0);

    for (int i = 0; i < 4; i++) {
        float cycleTime = 2.5;
        float t = iTime * 0.8 + float(i) * cycleTime * 0.25;
        float phase = mod(t, cycleTime);
        float age = phase / cycleTime;

        vec2 origin = (i == 0 && hasInput) ? mouseCentered : vec2(
            sin(floor(t / cycleTime) * 2.1 + float(i)) * 0.25,
            cos(floor(t / cycleTime) * 1.7 + float(i) * 0.7) * 0.25
        );

        float dist = length(uv - origin);
        float waveRadius = age * 0.8;
        float waveWidth = 0.03 + age * 0.02;
        float waveFalloff = max(0.0, 1.0 - age);

        float wave = exp(-pow(dist - waveRadius, 2.0) / (waveWidth * waveWidth));
        wave *= waveFalloff;

        vec2 dir = normalize(uv - origin + 0.001);
        distortedUv += dir * wave * 0.05 * waveFalloff;

        float innerRing = exp(-pow(dist - waveRadius * 0.8, 2.0) / (waveWidth * 0.5 * waveWidth * 0.5));
        float outerRing = exp(-pow(dist - waveRadius * 1.1, 2.0) / (waveWidth * 0.3 * waveWidth * 0.3));

        vec3 ringColor = mix(vec3(0.2, 0.5, 1.0), vec3(0.0, 1.0, 0.8), age);
        waveColor += wave * ringColor * 0.8;
        waveColor += innerRing * waveFalloff * vec3(0.5, 0.7, 1.0) * 0.4;
        waveColor += outerRing * waveFalloff * vec3(0.1, 0.3, 0.6) * 0.3;

        float flash = exp(-age * 8.0) * exp(-dist * 10.0);
        waveColor += flash * vec3(0.8, 0.9, 1.0) * 2.0;
    }

    float distGrid = smoothstep(0.01, 0.0, abs(fract(distortedUv.x * 8.0) - 0.5) - 0.48) +
                     smoothstep(0.01, 0.0, abs(fract(distortedUv.y * 8.0) - 0.5) - 0.48);
    vec3 distBg = vec3(0.05, 0.08, 0.12) + distGrid * vec3(0.02, 0.04, 0.06);

    vec3 col = distBg + waveColor;
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
