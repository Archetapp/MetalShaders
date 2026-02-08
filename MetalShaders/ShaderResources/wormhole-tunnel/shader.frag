#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float whNoise(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0);

    float r = length(uv);
    float a = atan(uv.y, uv.x);
    float tunnel = 0.2 / (r + 0.01);
    float twist = a / 6.2832 + tunnel * 0.1 + iTime * 0.1;

    float texU = twist;
    float texV = tunnel - iTime * 2.0;

    float grid = smoothstep(0.02, 0.0, abs(fract(texU * 8.0) - 0.5) - 0.45) +
                 smoothstep(0.02, 0.0, abs(fract(texV * 4.0) - 0.5) - 0.45);
    grid = clamp(grid, 0.0, 1.0);

    float depth = exp(-r * 3.0);
    vec3 tunnelCol = mix(vec3(0.05, 0.0, 0.15), vec3(0.2, 0.1, 0.4), depth);
    tunnelCol += grid * vec3(0.3, 0.2, 0.6) * 0.5 * (1.0 - depth * 0.5);

    float distortion = whNoise(vec2(texU * 10.0, texV * 5.0));
    vec3 warpCol = mix(vec3(0.1, 0.0, 0.3), vec3(0.5, 0.2, 0.8), distortion);
    tunnelCol = mix(tunnelCol, warpCol, 0.3);

    float edgeGlow = exp(-r * 8.0);
    tunnelCol += vec3(0.5, 0.3, 1.0) * edgeGlow;

    float centerLight = exp(-r * r * 20.0);
    tunnelCol += vec3(0.8, 0.9, 1.0) * centerLight;

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float starA = whNoise(vec2(fi, 0.0)) * 6.2832;
        float starR = whNoise(vec2(0.0, fi)) * 0.5;
        float speed = 0.5 + whNoise(vec2(fi, fi)) * 1.5;
        float starDepth = fract(starR - iTime * speed * 0.1);
        vec2 starPos = vec2(cos(starA), sin(starA)) * starDepth;
        float d = length(uv - starPos);
        float streak = exp(-d * d * 2000.0) * (1.0 - starDepth);
        tunnelCol += vec3(0.7, 0.8, 1.0) * streak;
    }

    col = tunnelCol;
    fragColor = vec4(col, 1.0);
}
