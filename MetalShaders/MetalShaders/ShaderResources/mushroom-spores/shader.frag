#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float sporeHash(float n) { return fract(sin(n) * 43758.5453); }
float sporeHash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.03, 0.02);

    vec2 capCenter = vec2(0.0, -0.05);
    float capR = length(uv - capCenter);
    float capA = atan(uv.y - capCenter.y, uv.x - capCenter.x);
    float capShape = 0.15 * (1.0 + 0.1 * sin(capA * 8.0));
    float cap = smoothstep(capShape, capShape - 0.01, capR) * step(capCenter.y - 0.02, uv.y);
    vec3 capCol = mix(vec3(0.5, 0.2, 0.1), vec3(0.7, 0.35, 0.15), (uv.y - capCenter.y) * 3.0);
    float spots = sporeHash2(floor(uv * 30.0));
    capCol = mix(capCol, vec3(0.9, 0.8, 0.6), step(0.85, spots) * cap);
    col = mix(col, capCol, cap);

    float stem = smoothstep(0.03, 0.02, abs(uv.x)) * step(-0.3, uv.y) * step(uv.y, capCenter.y);
    col = mix(col, vec3(0.6, 0.55, 0.45), stem);

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float seed = sporeHash(fi * 13.37);
        float birthTime = seed * 4.0;
        float age = mod(iTime - birthTime, 4.0);

        float angle = sporeHash(fi * 7.13) * 6.28318;
        float speed = 0.02 + sporeHash(fi * 3.71) * 0.03;
        float drift = sporeHash(fi * 11.3) - 0.5;

        vec2 sporePos = capCenter + vec2(0.0, 0.1);
        sporePos.x += sin(angle) * speed * age + drift * 0.05 * sin(iTime + fi);
        sporePos.y += cos(angle) * speed * age * 0.5 + age * 0.04;
        sporePos.x += sin(iTime * 2.0 + fi) * 0.01 * age;

        float sporeSize = 0.003 * (1.0 - age / 4.0);
        float sporeDist = length(uv - sporePos);
        float spore = smoothstep(sporeSize, sporeSize * 0.2, sporeDist);

        float alpha = smoothstep(4.0, 2.0, age) * smoothstep(0.0, 0.3, age);
        col += spore * vec3(0.6, 0.5, 0.3) * alpha * 0.8;
        col += exp(-sporeDist * 200.0) * vec3(0.3, 0.25, 0.15) * alpha * 0.3;
    }

    fragColor = vec4(col, 1.0);
}
