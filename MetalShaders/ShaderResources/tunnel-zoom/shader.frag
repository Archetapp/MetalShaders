#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float depth = 1.0 / (r + 0.05);
    float texU = a / 6.2832;
    float texV = depth - iTime * 1.5;

    float checker = step(0.5, fract(texU * 8.0)) * step(0.5, fract(texV * 4.0)) +
                    (1.0 - step(0.5, fract(texU * 8.0))) * (1.0 - step(0.5, fract(texV * 4.0)));

    float fog = 1.0 - exp(-r * 4.0);
    vec3 colA = mix(vec3(0.2, 0.0, 0.4), vec3(0.8, 0.2, 0.5), checker);
    vec3 colB = vec3(0.0, 0.02, 0.05);
    vec3 col = mix(colB, colA, fog);

    float rings = abs(sin(depth * 3.0 - iTime * 3.0));
    col += vec3(0.1, 0.05, 0.2) * rings * fog * 0.3;

    float light = 0.5 + 0.5 * sin(a * 4.0 + iTime * 2.0);
    col *= 0.8 + 0.2 * light;

    float center = exp(-r * r * 8.0);
    col += vec3(0.5, 0.3, 0.7) * center * 0.5;

    fragColor = vec4(col, 1.0);
}
