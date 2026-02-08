#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.8;

    float v1 = sin(uv.x * 10.0 + t);
    float v2 = sin(uv.y * 10.0 + t * 0.7);
    float v3 = sin((uv.x + uv.y) * 10.0 + t * 0.5);
    float v4 = sin(length(uv - 0.5) * 14.0 - t * 1.2);

    float v = (v1 + v2 + v3 + v4) * 0.25;

    vec3 col;
    col.r = sin(v * 3.14159 + 0.0) * 0.5 + 0.5;
    col.g = sin(v * 3.14159 + 2.094) * 0.5 + 0.5;
    col.b = sin(v * 3.14159 + 4.189) * 0.5 + 0.5;

    fragColor = vec4(col, 1.0);
}
