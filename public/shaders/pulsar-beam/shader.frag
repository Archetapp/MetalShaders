#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.015);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float starSize = 0.02;
    float star = smoothstep(starSize, starSize * 0.3, r);
    col += vec3(0.7, 0.8, 1.0) * star;

    float pulsarGlow = exp(-r * 20.0);
    col += vec3(0.3, 0.4, 0.8) * pulsarGlow;

    float beamAngle = iTime * 4.0;
    float beam1Angle = a - beamAngle;
    float beam2Angle = a - beamAngle - 3.14159;

    float beamWidth = 0.08;
    float beam1 = exp(-pow(mod(beam1Angle + 3.14159, 6.28318) - 3.14159, 2.0) / (beamWidth * beamWidth));
    float beam2 = exp(-pow(mod(beam2Angle + 3.14159, 6.28318) - 3.14159, 2.0) / (beamWidth * beamWidth));

    float beamFade = exp(-r * 1.5) * step(0.02, r);
    vec3 beamCol = mix(vec3(0.3, 0.5, 1.0), vec3(0.6, 0.8, 1.0), r * 2.0);
    col += (beam1 + beam2) * beamCol * beamFade;

    float rings = sin(r * 60.0 - iTime * 3.0) * 0.5 + 0.5;
    rings *= exp(-r * 8.0);
    col += vec3(0.2, 0.3, 0.5) * rings * 0.2;

    float magneticField = exp(-abs(uv.y) * 10.0) * exp(-r * 3.0);
    col += vec3(0.1, 0.15, 0.3) * magneticField * 0.3;

    for (int i = 0; i < 50; i++) {
        float fi = float(i);
        vec2 sp = vec2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) - 0.5);
        float d = length(uv - sp);
        col += exp(-d * d * 5000.0) * vec3(0.6, 0.65, 0.8) * 0.4;
    }

    fragColor = vec4(col, 1.0);
}
