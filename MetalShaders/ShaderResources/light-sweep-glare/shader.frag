#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec3 surface = vec3(0.15, 0.15, 0.18);
    surface += sin(centered.x * 100.0) * 0.01;

    float sweepPos = sin(iTime * 0.8) * 1.5;
    float sweepAngle = 0.3;
    float sweepLine = centered.x * cos(sweepAngle) + centered.y * sin(sweepAngle) - sweepPos;

    float mainGlare = exp(-sweepLine * sweepLine * 20.0);
    float sharpGlare = exp(-sweepLine * sweepLine * 200.0);
    float wideGlow = exp(-sweepLine * sweepLine * 3.0);

    float anamorphic = exp(-centered.y * centered.y * 2.0) * sharpGlare;

    vec3 glareColor = vec3(1.0, 0.95, 0.9);
    vec3 col = surface;
    col += wideGlow * vec3(0.1, 0.12, 0.15) * 0.3;
    col += mainGlare * glareColor * 0.5;
    col += sharpGlare * glareColor * 0.8;
    col += anamorphic * vec3(0.5, 0.6, 0.8) * 0.3;

    float specDots = pow(max(sin(centered.x * 50.0 + sweepPos * 10.0) * sin(centered.y * 50.0), 0.0), 8.0);
    col += specDots * mainGlare * 0.3;

    float edge = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, uv.y) *
                 smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.y);
    col *= edge;

    fragColor = vec4(col, 1.0);
}
