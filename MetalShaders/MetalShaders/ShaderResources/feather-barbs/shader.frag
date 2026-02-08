#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.02, 0.03);

    float rachis = smoothstep(0.008, 0.002, abs(uv.x));
    float featherMask = smoothstep(0.45, 0.4, abs(uv.y)) * smoothstep(0.0, 0.02, abs(uv.y) + abs(uv.x) * 0.5);

    float barbSpacing = 0.02;
    float barbY = mod(uv.y + 0.5, barbSpacing) - barbSpacing * 0.5;
    float barbAngle = sign(uv.x) * 0.5;
    float barbD = abs(barbY * cos(barbAngle) - (uv.x) * sin(barbAngle));
    float barb = smoothstep(0.003, 0.001, barbD) * step(0.005, abs(uv.x)) * featherMask;

    float barbuleSpacing = 0.004;
    float barbuleD = mod(length(uv * vec2(0.5, 1.0)), barbuleSpacing);
    barbuleD = abs(barbuleD - barbuleSpacing * 0.5);
    float barbule = smoothstep(0.001, 0.0005, barbuleD) * barb * 0.3;

    float viewAngle = uv.x * 10.0 + uv.y * 5.0 + iTime * 0.5;
    vec3 iridCol = 0.5 + 0.5 * cos(viewAngle + vec3(0.0, 2.094, 4.189));
    iridCol = mix(iridCol, vec3(0.0, 0.3, 0.5), 0.3);

    vec3 baseCol = mix(vec3(0.15, 0.1, 0.05), iridCol, 0.6);

    col = mix(col, baseCol * 1.2, rachis * featherMask);
    col = mix(col, baseCol, barb);
    col += barbule * iridCol;

    float shimmer = 0.5 + 0.5 * sin(iTime * 2.0 + uv.y * 20.0);
    col += featherMask * barb * shimmer * vec3(0.05, 0.08, 0.1);

    fragColor = vec4(col, 1.0);
}
