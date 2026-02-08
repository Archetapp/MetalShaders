#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform float iMouseDown;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float elaHash(float n) {
    return fract(sin(n) * 43758.5453);
}

float elaNoise(float p) {
    float i = floor(p);
    float f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(elaHash(i), elaHash(i + 1.0), f);
}

float elaLightning(vec2 uv, vec2 a, vec2 b, float seed, float width) {
    vec2 ab = b - a;
    float len = length(ab);
    vec2 dir = ab / len;
    vec2 perp = vec2(-dir.y, dir.x);

    float proj = dot(uv - a, dir);
    float t = clamp(proj / len, 0.0, 1.0);

    float offset = 0.0;
    float amp = 0.08;
    for (int i = 0; i < 6; i++) {
        float freq = pow(2.0, float(i)) * 3.0;
        float timeShift = iTime * (8.0 + float(i) * 2.0);
        offset += amp * (elaNoise(t * freq + seed + timeShift) - 0.5);
        amp *= 0.6;
    }

    vec2 boltPoint = a + dir * proj + perp * offset;
    float dist = length(uv - boltPoint);

    float glow = width / (dist + 0.001);
    glow *= smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.95, t);

    return glow;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    bool isInteracting = iMouseDown > 0.5;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);

    vec2 pointA = vec2(-0.35, sin(iTime * 0.3) * 0.15);
    vec2 pointB = isInteracting ? mouseCentered : vec2(0.35, cos(iTime * 0.4) * 0.15);

    vec3 col = vec3(0.02, 0.01, 0.04);

    float totalGlow = 0.0;
    for (int i = 0; i < 5; i++) {
        float seed = float(i) * 17.3 + floor(iTime * 4.0) * 7.1;
        float width = 0.003 - float(i) * 0.0004;
        float brightness = 1.0 - float(i) * 0.15;
        float bolt = elaLightning(uv, pointA, pointB, seed, width);
        totalGlow += bolt * brightness;

        if (i < 2) {
            float branchT = 0.3 + float(i) * 0.3;
            vec2 branchStart = mix(pointA, pointB, branchT);
            float branchAngle = (elaHash(seed + 50.0) - 0.5) * 1.5;
            vec2 branchEnd = branchStart + vec2(cos(branchAngle), sin(branchAngle)) * 0.15;
            float branch = elaLightning(uv, branchStart, branchEnd, seed + 100.0, width * 0.7);
            totalGlow += branch * brightness * 0.5;
        }
    }

    vec3 boltColor = vec3(0.4, 0.6, 1.0);
    vec3 coreColor = vec3(0.8, 0.9, 1.0);

    col += boltColor * totalGlow * 0.1;
    col += coreColor * pow(totalGlow * 0.05, 2.0);

    float glowA = exp(-length(uv - pointA) * 8.0) * 0.3;
    float glowB = exp(-length(uv - pointB) * 8.0) * 0.3;
    col += vec3(0.3, 0.5, 1.0) * (glowA + glowB);

    float flicker = 0.8 + 0.2 * sin(iTime * 30.0);
    col *= flicker;

    col = pow(col, vec3(0.85));
    fragColor = vec4(col, 1.0);
}
