#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fpNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.92, 0.85, 0.75);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float whorlCenter = r * 15.0 + a * 1.5;
    float distortion = fpNoise(uv * 3.0 + iTime * 0.05) * 2.0;
    float ridgePattern = sin(whorlCenter + distortion + sin(uv.y * 20.0 + distortion) * 1.5);

    float ridge = smoothstep(0.0, 0.3, ridgePattern) - smoothstep(0.3, 0.6, ridgePattern);
    ridge *= 0.6;

    float fingerMask = smoothstep(0.4, 0.35, r);
    fingerMask *= smoothstep(-0.5, -0.3, uv.y);

    vec3 ridgeCol = vec3(0.55, 0.4, 0.35);
    vec3 valleyCol = vec3(0.85, 0.75, 0.65);
    col = mix(valleyCol, ridgeCol, ridge * fingerMask);

    float scan = smoothstep(0.005, 0.0, abs(uv.y - mod(iTime * 0.3, 1.0) + 0.5));
    col += vec3(0.0, 0.3, 0.0) * scan * fingerMask * 0.5;

    col = mix(vec3(0.92, 0.85, 0.75), col, fingerMask);

    fragColor = vec4(col, 1.0);
}
