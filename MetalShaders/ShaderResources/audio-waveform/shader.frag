#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float awWaveform(float x, float t) {
    float wave = 0.0;
    wave += sin(x * 6.28 * 2.0 + t * 3.0) * 0.3;
    wave += sin(x * 6.28 * 5.0 + t * 7.0) * 0.15;
    wave += sin(x * 6.28 * 11.0 + t * 13.0) * 0.08;
    wave += sin(x * 6.28 * 23.0 + t * 5.0) * 0.04;
    wave += sin(x * 6.28 * 1.0 + t * 1.5) * 0.2;

    float envelope = sin(x * 3.14159 * 0.8 + t * 0.5) * 0.5 + 0.5;
    envelope *= smoothstep(0.0, 0.1, x) * smoothstep(1.0, 0.9, x);

    float beat = pow(sin(t * 2.5) * 0.5 + 0.5, 4.0);
    wave *= envelope * (0.6 + beat * 0.4);

    return wave;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime;

    vec3 col = vec3(0.01, 0.02, 0.01);

    float gridX = abs(fract(centered.x * 10.0) - 0.5);
    float gridY = abs(fract(centered.y * 10.0) - 0.5);
    float grid = smoothstep(0.48, 0.5, gridX) + smoothstep(0.48, 0.5, gridY);
    col += vec3(0.0, 0.05, 0.0) * grid * 0.3;

    float axisX = smoothstep(0.003, 0.0, abs(centered.y));
    float axisY = smoothstep(0.003, 0.0, abs(centered.x));
    col += vec3(0.0, 0.1, 0.0) * (axisX + axisY) * 0.5;

    float subGridX = abs(fract(centered.x * 50.0) - 0.5);
    float subGridY = abs(fract(centered.y * 50.0) - 0.5);
    float subGrid = smoothstep(0.48, 0.5, subGridX) + smoothstep(0.48, 0.5, subGridY);
    col += vec3(0.0, 0.02, 0.0) * subGrid * 0.15;

    float waveY = awWaveform(uv.x, t);
    float screenY = centered.y;
    float dist = abs(screenY - waveY * 0.35);

    float line = 0.002 / (dist + 0.002);
    vec3 neonGreen = vec3(0.1, 1.0, 0.2);
    col += neonGreen * line * 0.15;

    float glow1 = exp(-dist * dist * 200.0);
    col += neonGreen * glow1 * 0.8;

    float glow2 = exp(-dist * dist * 30.0);
    col += vec3(0.05, 0.5, 0.1) * glow2 * 0.5;

    float glow3 = exp(-dist * dist * 5.0);
    col += vec3(0.02, 0.15, 0.03) * glow3 * 0.3;

    float scanline = sin(gl_FragCoord.y * 1.5) * 0.03 + 0.97;
    col *= scanline;

    float phosphor = exp(-dist * dist * 80.0) * 0.1;
    col += vec3(0.0, phosphor * 0.3, 0.0);

    float vignetteX = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
    float vignetteY = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
    col *= vignetteX * vignetteY;

    col *= 1.0 + 0.05 * sin(t * 60.0);

    float borderDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float border = smoothstep(0.02, 0.04, borderDist);
    col *= border;
    col += vec3(0.0, 0.15, 0.0) * smoothstep(0.04, 0.02, borderDist) * 0.3;

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
