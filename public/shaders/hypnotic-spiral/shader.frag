#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float logR = log(r + 0.001);
    float spiral = sin(a * 3.0 - logR * 8.0 + iTime * 2.0);
    float bands = smoothstep(-0.1, 0.1, spiral);

    vec3 col1 = mix(vec3(0.1, 0.0, 0.3), vec3(0.8, 0.2, 0.5), bands);
    vec3 col2 = mix(vec3(0.0, 0.1, 0.3), vec3(0.2, 0.5, 0.9), bands);

    float hueShift = iTime * 0.5 + logR * 2.0;
    vec3 rainbow = 0.5 + 0.5 * cos(hueShift + vec3(0.0, 2.094, 4.189));

    col = mix(col1, col2, sin(iTime * 0.3) * 0.5 + 0.5);
    col = mix(col, rainbow, 0.3);

    float pulse = 0.8 + 0.2 * sin(r * 20.0 - iTime * 4.0);
    col *= pulse;

    float vignette = 1.0 - smoothstep(0.2, 0.6, r);
    col *= 0.5 + 0.5 * vignette;

    fragColor = vec4(col, 1.0);
}
