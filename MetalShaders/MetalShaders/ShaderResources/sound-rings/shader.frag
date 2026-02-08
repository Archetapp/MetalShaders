#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    float bass = sin(iTime * 2.5) * 0.5 + 0.5;
    float mid = sin(iTime * 5.0 + 1.5) * 0.3 + 0.5;
    float treble = sin(iTime * 10.0 + 3.0) * 0.2 + 0.5;

    vec3 col = vec3(0.02, 0.01, 0.04);

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float ringRadius = 0.05 + fi * 0.06;
        float ringWidth = 0.008 + fi * 0.002;

        float freq = fi < 3.0 ? bass : fi < 6.0 ? mid : treble;
        float pulse = freq * (0.02 + fi * 0.005);
        float animRadius = ringRadius + pulse;

        float angularDeform = sin(angle * (3.0 + fi) + iTime * (2.0 - fi * 0.2)) * freq * 0.01;
        animRadius += angularDeform;

        float ring = exp(-pow(dist - animRadius, 2.0) / (ringWidth * ringWidth));

        float hue = fi / 8.0;
        vec3 ringColor = 0.5 + 0.5 * cos(6.28 * (hue + iTime * 0.1 + vec3(0.0, 0.33, 0.67)));
        ringColor *= 0.5 + freq * 0.5;

        col += ring * ringColor * (0.4 + freq * 0.6);
    }

    float centerGlow = exp(-dist * 15.0) * (bass * 0.5 + 0.2);
    col += centerGlow * vec3(0.5, 0.3, 0.8);

    float outerPulse = sin(dist * 30.0 - iTime * 5.0) * exp(-dist * 3.0) * bass * 0.1;
    col += max(outerPulse, 0.0) * vec3(0.3, 0.4, 0.6);

    float particleAngle = angle + iTime * 0.5;
    float particleRing = sin(particleAngle * 12.0) * 0.5 + 0.5;
    float particleDist = abs(dist - 0.35 - bass * 0.05);
    float particles = pow(particleRing, 8.0) * exp(-particleDist * 50.0) * 0.5;
    col += particles * vec3(0.6, 0.7, 1.0);

    col = pow(col, vec3(0.9));
    fragColor = vec4(col, 1.0);
}
