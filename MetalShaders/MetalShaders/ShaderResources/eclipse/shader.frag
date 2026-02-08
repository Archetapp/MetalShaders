#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float eclipseNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.002, 0.002, 0.01);

    float sunR = 0.2;
    float moonR = 0.19;
    float moonOffset = sin(iTime * 0.3) * 0.15;
    vec2 moonPos = vec2(moonOffset, moonOffset * 0.3);

    float sunDist = length(uv);
    float moonDist = length(uv - moonPos);

    float sunMask = smoothstep(sunR + 0.005, sunR - 0.005, sunDist);
    float moonMask = smoothstep(moonR + 0.003, moonR - 0.003, moonDist);

    col += vec3(1.0, 0.9, 0.6) * sunMask;

    float a = atan(uv.y, uv.x);
    float coronaR = sunR + 0.05 + 0.03 * sin(a * 8.0 + iTime) + 0.02 * sin(a * 13.0 - iTime * 0.7);
    float corona = exp(-(sunDist - sunR) * 8.0) * step(sunR * 0.95, sunDist);
    float coronaRays = pow(abs(sin(a * 6.0 + iTime * 0.3)), 2.0);
    corona *= 0.5 + 0.5 * coronaRays;

    float occluded = moonMask;
    corona *= (1.0 - occluded * 0.7);

    col += vec3(1.0, 0.8, 0.5) * corona * 0.6;

    float outerCorona = exp(-(sunDist - sunR) * 3.0) * step(sunR, sunDist);
    col += vec3(0.4, 0.3, 0.5) * outerCorona * 0.3;

    col *= (1.0 - moonMask);
    col += vec3(0.02, 0.02, 0.03) * moonMask;

    float rimLight = smoothstep(moonR + 0.01, moonR - 0.005, moonDist) *
                     smoothstep(moonR - 0.02, moonR - 0.005, moonDist);
    float rimAngle = atan(uv.y - moonPos.y, uv.x - moonPos.x);
    float rimDir = dot(normalize(uv - moonPos), normalize(-moonPos));
    rimLight *= smoothstep(-0.5, 0.5, rimDir);
    col += vec3(1.0, 0.7, 0.4) * rimLight * 2.0;

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        vec2 sp = vec2(eclipseNoise(vec2(fi, 0.0)) - 0.5, eclipseNoise(vec2(0.0, fi)) - 0.5);
        float d = length(uv - sp);
        float twinkle = 0.5 + 0.5 * sin(iTime * 2.0 + fi * 5.0);
        col += exp(-d * d * 6000.0) * vec3(0.7, 0.75, 0.9) * 0.3 * twinkle;
    }

    fragColor = vec4(col, 1.0);
}
