#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.05, 0.05, 0.08);

    float gridSize = 0.06;
    vec2 gridID = floor(uv / gridSize);
    vec2 gridUV = fract(uv / gridSize) - 0.5;

    float distFromCenter = length(gridID * gridSize);
    float wave1 = sin(distFromCenter * 15.0 - iTime * 3.0) * 0.5 + 0.5;
    float wave2 = sin(gridID.x * 2.0 + gridID.y * 2.0 - iTime * 2.0) * 0.5 + 0.5;
    float wave = mix(wave1, wave2, sin(iTime * 0.3) * 0.5 + 0.5);

    float radius = 0.15 + 0.3 * wave;
    float circle = smoothstep(radius + 0.05, radius - 0.05, length(gridUV));

    vec3 circleCol = 0.5 + 0.5 * cos(distFromCenter * 5.0 + iTime + vec3(0.0, 2.094, 4.189));
    circleCol *= 0.5 + 0.5 * wave;

    col = mix(col, circleCol, circle);

    float glow = exp(-length(gridUV) * 4.0) * wave * 0.2;
    col += circleCol * glow;

    fragColor = vec4(col, 1.0);
}
