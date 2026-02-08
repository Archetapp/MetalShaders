#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float heartSDF(vec2 p) {
    p.y -= 0.05;
    p.x = abs(p.x);
    float a = atan(p.y, p.x) / 3.14159;
    float r = length(p);
    float h = abs(a);
    float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);
    return r - d * 0.15;
}

float ecgWave(float x) {
    float t = mod(x, 1.0);
    float y = 0.0;
    y += 0.05 * exp(-pow((t - 0.1) * 20.0, 2.0));
    y -= 0.03 * exp(-pow((t - 0.2) * 30.0, 2.0));
    y += 0.3 * exp(-pow((t - 0.25) * 40.0, 2.0));
    y -= 0.08 * exp(-pow((t - 0.3) * 30.0, 2.0));
    y += 0.07 * exp(-pow((t - 0.55) * 15.0, 2.0));
    return y;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.02, 0.04);

    float pulse = sin(iTime * 4.0) * 0.5 + 0.5;
    pulse = pow(pulse, 4.0);
    float scale = 1.0 + pulse * 0.15;

    float heart = heartSDF(uv * scale);
    float heartMask = smoothstep(0.01, -0.01, heart);
    float heartEdge = smoothstep(0.02, 0.0, abs(heart));

    vec3 heartCol = mix(vec3(0.7, 0.05, 0.1), vec3(1.0, 0.2, 0.2), pulse);
    col = mix(col, heartCol, heartMask);
    col += vec3(1.0, 0.3, 0.3) * heartEdge * 0.5;

    float glow = exp(-heart * 8.0) * pulse * 0.4;
    col += vec3(0.8, 0.1, 0.15) * glow;

    float ecgY = ecgWave(uv.x * 1.5 + iTime * 0.8) * 0.5;
    float ecgLine = smoothstep(0.005, 0.001, abs(uv.y + 0.3 - ecgY));
    float ecgTrail = smoothstep(0.0, -0.3, uv.x - mod(-iTime * 0.53, 1.0) + 0.17);
    col += vec3(0.0, 1.0, 0.3) * ecgLine * ecgTrail;
    col += vec3(0.0, 0.2, 0.05) * exp(-abs(uv.y + 0.3 - ecgY) * 30.0) * ecgTrail;

    fragColor = vec4(col, 1.0);
}
