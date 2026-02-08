#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float nnHash(float n) { return fract(sin(n) * 43758.5453); }

vec2 nnNodePos(float id) {
    return vec2(nnHash(id * 17.31) - 0.5, nnHash(id * 23.17) - 0.5) * 0.8;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.01, 0.02, 0.05);

    float nodeCount = 20.0;
    float connectionDist = 0.35;

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        vec2 ni = nnNodePos(fi);
        ni += vec2(sin(iTime * 0.5 + fi), cos(iTime * 0.3 + fi * 1.3)) * 0.02;

        for (int j = i + 1; j < 20; j++) {
            float fj = float(j);
            vec2 nj = nnNodePos(fj);
            nj += vec2(sin(iTime * 0.5 + fj), cos(iTime * 0.3 + fj * 1.3)) * 0.02;

            float dist = length(ni - nj);
            if (dist < connectionDist) {
                vec2 pa = uv - ni, ba = nj - ni;
                float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                float d = length(pa - ba * h);
                float line = smoothstep(0.003, 0.001, d);

                float signal = sin(h * 10.0 - iTime * 3.0 + fi + fj) * 0.5 + 0.5;
                signal = pow(signal, 4.0);
                float alpha = (1.0 - dist / connectionDist) * 0.3;
                col += line * mix(vec3(0.1, 0.15, 0.3), vec3(0.3, 0.6, 1.0), signal) * alpha;
            }
        }
    }

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        vec2 ni = nnNodePos(fi);
        ni += vec2(sin(iTime * 0.5 + fi), cos(iTime * 0.3 + fi * 1.3)) * 0.02;

        float d = length(uv - ni);
        float node = smoothstep(0.012, 0.005, d);
        float pulse = 0.5 + 0.5 * sin(iTime * 2.0 + fi * 1.7);
        float glow = exp(-d * 40.0) * (0.3 + 0.7 * pow(pulse, 3.0));

        vec3 nodeCol = mix(vec3(0.2, 0.4, 0.8), vec3(0.5, 0.8, 1.0), pulse);
        col += node * nodeCol;
        col += glow * nodeCol * 0.5;
    }

    fragColor = vec4(col, 1.0);
}
