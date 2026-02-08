#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 mlRotate(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float mlLines(vec2 uv, float angle, float freq, float thickness) {
    vec2 rotUV = mlRotate(uv, angle);
    float line = abs(sin(rotUV.x * freq * 3.14159));
    return smoothstep(thickness, thickness + 0.02, line);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float angle1 = t * 0.15;
    float angle2 = -t * 0.12 + 0.5;
    float angle3 = t * 0.08 + 1.0;

    float freq1 = 30.0 + sin(t * 0.3) * 5.0;
    float freq2 = 32.0 + cos(t * 0.4) * 5.0;
    float freq3 = 28.0 + sin(t * 0.5 + 1.0) * 4.0;

    float thickness = 0.3;

    float grid1 = mlLines(uv, angle1, freq1, thickness);
    float grid2 = mlLines(uv, angle2, freq2, thickness);
    float grid3 = mlLines(uv, angle3, freq3, thickness);

    float moire1 = grid1 * grid2;
    float moire2 = grid2 * grid3;
    float moire3 = grid1 * grid3;

    vec3 col = vec3(0.02);
    col += vec3(0.9, 0.3, 0.2) * (1.0 - moire1) * 0.5;
    col += vec3(0.2, 0.5, 0.9) * (1.0 - moire2) * 0.5;
    col += vec3(0.3, 0.8, 0.4) * (1.0 - moire3) * 0.3;

    float combined = (1.0 - grid1) * 0.33 + (1.0 - grid2) * 0.33 + (1.0 - grid3) * 0.33;
    col += vec3(0.9) * combined * 0.3;

    float pulse = 0.5 + 0.5 * sin(length(uv) * 10.0 - t * 2.0);
    col *= 0.8 + 0.2 * pulse;

    float vig = 1.0 - 0.3 * dot(uv, uv);
    col *= vig;

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
