#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float warpHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0, 0.0, 0.02);

    float warpFactor = 0.5 + 0.5 * sin(iTime * 0.5);
    float streakLen = 0.01 + warpFactor * 0.15;

    for (int i = 0; i < 120; i++) {
        float fi = float(i);
        float angle = warpHash(fi * 73.1) * 6.2832;
        float baseR = warpHash(fi * 31.7) * 0.5 + 0.02;
        float speed = 0.2 + warpHash(fi * 17.3) * 0.8;
        float depth = fract(baseR - iTime * speed * 0.3);

        vec2 starDir = vec2(cos(angle), sin(angle));
        vec2 starPos = starDir * depth;

        vec2 toStar = uv - starPos;
        float along = dot(toStar, starDir);
        float perp = abs(dot(toStar, vec2(-starDir.y, starDir.x)));

        float sLen = streakLen * (1.0 - depth) * speed;
        float streak = exp(-perp * perp * 40000.0) *
                       smoothstep(sLen, 0.0, along) * smoothstep(-0.005, 0.0, along);
        float head = exp(-dot(toStar, toStar) * 8000.0);

        float brightness = (1.0 - depth) * (0.5 + warpFactor * 0.5);
        vec3 starCol = mix(vec3(0.5, 0.6, 1.0), vec3(1.0, 0.9, 0.8), warpHash(fi * 41.3));
        col += (head * 1.5 + streak) * starCol * brightness;
    }

    float tunnel = exp(-length(uv) * 2.0 * (1.0 - warpFactor * 0.8));
    col += vec3(0.05, 0.08, 0.2) * tunnel * warpFactor;

    float flash = pow(warpFactor, 8.0) * exp(-length(uv) * 5.0);
    col += vec3(0.5, 0.6, 1.0) * flash;

    fragColor = vec4(col, 1.0);
}
