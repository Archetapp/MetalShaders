#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float cylR = 0.1;
    float distFromCenter = length(uv);
    float anamorphFactor = 1.0 + 3.0 * exp(-distFromCenter * distFromCenter * 8.0);
    anamorphFactor *= 1.0 + 0.3 * sin(iTime);

    vec2 distorted = uv;
    distorted.y *= anamorphFactor;

    float checker = step(0.5, fract(distorted.x * 5.0)) + step(0.5, fract(distorted.y * 5.0));
    checker = mod(checker, 2.0);

    vec3 col1 = vec3(0.9, 0.3, 0.2);
    vec3 col2 = vec3(0.2, 0.3, 0.8);
    vec3 col = mix(col1, col2, checker);

    float circle = smoothstep(0.12, 0.11, length(distorted - vec2(0.0, 0.2 + sin(iTime) * 0.1)));
    col = mix(col, vec3(1.0, 0.9, 0.2), circle);

    float star = 0.0;
    for (int i = 0; i < 5; i++) {
        float a = float(i) * 1.2566;
        vec2 sp = distorted - vec2(cos(a) * 0.15, sin(a) * 0.15 + 0.0);
        star += smoothstep(0.03, 0.02, length(sp));
    }
    col = mix(col, vec3(0.2, 0.8, 0.3), clamp(star, 0.0, 1.0));

    float grid = smoothstep(0.02, 0.0, abs(fract(distorted.x * 10.0) - 0.5) - 0.48) +
                 smoothstep(0.02, 0.0, abs(fract(distorted.y * 10.0) - 0.5) - 0.48);
    col = mix(col, vec3(0.0), clamp(grid, 0.0, 1.0) * 0.15);

    float vignette = 1.0 - smoothstep(0.3, 0.6, distFromCenter);
    col *= 0.7 + 0.3 * vignette;

    fragColor = vec4(col, 1.0);
}
