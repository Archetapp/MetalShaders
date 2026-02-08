#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float grain(vec2 uv, float t) {
    float seed = dot(uv, vec2(12.9898, 78.233));
    return fract(sin(seed + t) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;

    vec3 baseColor = vec3(0.0);
    float gradY = uv.y;
    baseColor = mix(vec3(0.15, 0.08, 0.05), vec3(0.05, 0.03, 0.02), gradY);

    float vignette = 1.0 - length((uv - 0.5) * 1.4);
    vignette = smoothstep(0.0, 0.7, vignette);

    float frameT = floor(t * 24.0);

    float g1 = grain(gl_FragCoord.xy, frameT);
    float g2 = grain(gl_FragCoord.xy + 100.0, frameT + 0.5);
    float g3 = grain(gl_FragCoord.xy * 0.5, frameT * 1.3);

    float grainVal = (g1 + g2 + g3) / 3.0;
    grainVal = grainVal * 2.0 - 1.0;

    float intensity = 0.15;
    vec3 col = baseColor + grainVal * intensity;

    float scratches = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float scratchX = hash12(vec2(frameT * 0.1 + fi, fi * 7.0));
        float scratchW = 0.001;
        float s = smoothstep(scratchW, 0.0, abs(uv.x - scratchX));
        s *= step(0.5, hash12(vec2(frameT + fi, uv.y * 10.0)));
        scratches += s;
    }
    col += scratches * 0.2;

    float flicker = 1.0 + (hash12(vec2(frameT, 0.0)) - 0.5) * 0.06;
    col *= flicker;

    col *= vignette;

    float dustCount = 5.0;
    for (float i = 0.0; i < dustCount; i++) {
        vec2 dustPos = vec2(hash12(vec2(i + frameT * 0.05, i * 3.0)),
                           hash12(vec2(i * 5.0, frameT * 0.05 + i)));
        float dustSize = hash12(vec2(i, i)) * 0.003 + 0.001;
        float d = length(uv - dustPos);
        col -= smoothstep(dustSize * 2.0, dustSize, d) * 0.1;
    }

    col += vec3(0.02, 0.01, 0.0);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
