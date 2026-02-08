#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float solarNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float solarFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * solarNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv.y += 0.25;
    vec3 col = vec3(0.0);

    float r = length(uv);
    float sunR = 0.35;
    float sunMask = smoothstep(sunR + 0.01, sunR - 0.01, r);

    float surface = solarFbm(uv * 4.0 + iTime * 0.3);
    vec3 sunCol = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.9, 0.3), surface);
    float granules = solarFbm(uv * 15.0 + iTime * 0.5);
    sunCol *= 0.8 + 0.2 * granules;
    col = mix(col, sunCol, sunMask);

    float corona = exp(-(r - sunR) * 5.0) * step(sunR, r);
    float a = atan(uv.y, uv.x);
    float coronaRays = pow(abs(sin(a * 6.0 + iTime * 0.5)), 3.0);
    corona *= 0.5 + 0.5 * coronaRays;
    col += vec3(1.0, 0.5, 0.1) * corona * 0.4;

    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float flareAngle = fi * 2.0 + iTime * 0.3;
        float flareHeight = 0.15 + 0.1 * sin(iTime * 0.5 + fi);
        vec2 flareBase = vec2(cos(flareAngle), sin(flareAngle)) * sunR;
        vec2 flareTip = flareBase * (1.0 + flareHeight / sunR);

        for (float t = 0.0; t < 1.0; t += 0.02) {
            vec2 arcPoint = mix(flareBase, flareTip, t);
            float arcHeight = sin(t * 3.14159) * flareHeight;
            vec2 arcNormal = normalize(vec2(-sin(flareAngle), cos(flareAngle)));
            arcPoint += arcNormal * arcHeight;

            float d = length(uv - arcPoint);
            float flare = exp(-d * d * 3000.0);
            float intensity = sin(t * 3.14159) * (0.5 + 0.5 * sin(iTime * 3.0 + fi));
            col += flare * vec3(1.0, 0.4, 0.1) * intensity;
        }
    }

    float glow = exp(-r * 2.0) * 0.3;
    col += vec3(1.0, 0.3, 0.05) * glow;

    fragColor = vec4(col, 1.0);
}
