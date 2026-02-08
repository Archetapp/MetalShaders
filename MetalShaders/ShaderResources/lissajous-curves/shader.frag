#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.02, 0.04);

    float freqA = 3.0 + sin(iTime * 0.2) * 2.0;
    float freqB = 2.0 + cos(iTime * 0.3) * 1.5;
    float phase = iTime * 0.5;

    float minDist = 1.0;
    float closestT = 0.0;

    for (int i = 0; i < 300; i++) {
        float t = float(i) / 300.0 * 6.2832;
        vec2 p = vec2(sin(freqA * t + phase), sin(freqB * t)) * 0.35;
        float d = length(uv - p);
        if (d < minDist) {
            minDist = d;
            closestT = t;
        }
    }

    float curve = smoothstep(0.008, 0.002, minDist);
    float glow = exp(-minDist * 80.0);

    vec3 curveCol = 0.5 + 0.5 * cos(closestT * 2.0 + iTime + vec3(0.0, 2.094, 4.189));

    col += curve * curveCol;
    col += glow * curveCol * 0.3;

    for (int j = 1; j < 4; j++) {
        float fj = float(j);
        float fA = freqA + fj * 0.5;
        float fB = freqB + fj * 0.3;
        float ph = phase + fj * 1.0;
        float minD2 = 1.0;
        for (int i = 0; i < 200; i++) {
            float t = float(i) / 200.0 * 6.2832;
            vec2 p = vec2(sin(fA * t + ph), sin(fB * t)) * (0.3 - fj * 0.03);
            minD2 = min(minD2, length(uv - p));
        }
        float c2 = exp(-minD2 * 60.0) * (0.3 - fj * 0.08);
        col += c2 * (0.5 + 0.5 * cos(fj * 2.0 + iTime + vec3(1.0, 3.0, 5.0)));
    }

    fragColor = vec4(col, 1.0);
}
