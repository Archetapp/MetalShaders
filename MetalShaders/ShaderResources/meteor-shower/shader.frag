#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float meteorHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.02);

    for (int i = 0; i < 80; i++) {
        float fi = float(i);
        vec2 sp = vec2(meteorHash(fi * 73.1) - 0.5, meteorHash(fi * 91.3) - 0.5);
        float d = length(uv - sp);
        float twinkle = 0.6 + 0.4 * sin(iTime * (1.0 + meteorHash(fi * 11.0)) + fi * 7.0);
        col += exp(-d * d * 8000.0) * vec3(0.6, 0.65, 0.8) * 0.3 * twinkle;
    }

    for (int i = 0; i < 15; i++) {
        float fi = float(i);
        float birth = meteorHash(fi * 17.31) * 5.0;
        float t = mod(iTime - birth, 5.0);
        float life = smoothstep(0.0, 0.1, t) * smoothstep(1.5, 0.5, t);

        float startX = meteorHash(fi * 23.17) * 0.8 - 0.4;
        float startY = 0.3 + meteorHash(fi * 31.71) * 0.2;
        float angle = -0.7 - meteorHash(fi * 7.13) * 0.3;
        float speed = 0.3 + meteorHash(fi * 11.37) * 0.3;

        vec2 pos = vec2(startX, startY) + vec2(cos(angle), sin(angle)) * speed * t;
        vec2 dir = normalize(vec2(cos(angle), sin(angle)));

        vec2 toPoint = uv - pos;
        float along = dot(toPoint, dir);
        float perp = abs(dot(toPoint, vec2(-dir.y, dir.x)));

        float tailLen = 0.15 * life;
        float tail = exp(-perp * 400.0) * smoothstep(0.0, -tailLen, along) * smoothstep(-tailLen * 1.5, -tailLen * 0.5, along);
        float head = exp(-length(toPoint) * length(toPoint) * 3000.0);

        vec3 meteorCol = mix(vec3(1.0, 0.8, 0.4), vec3(1.0, 0.5, 0.2), -along / tailLen);
        col += (head * 2.0 + tail) * meteorCol * life;

        for (int j = 0; j < 3; j++) {
            float fj = float(j);
            vec2 sparkPos = pos + dir * (-0.02 - fj * 0.03) + vec2(meteorHash(fi * 100.0 + fj) - 0.5, meteorHash(fi * 200.0 + fj) - 0.5) * 0.02;
            float sparkD = length(uv - sparkPos);
            col += exp(-sparkD * sparkD * 5000.0) * vec3(1.0, 0.6, 0.2) * life * 0.3;
        }
    }

    fragColor = vec4(col, 1.0);
}
