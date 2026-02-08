#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

vec3 lenticularRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

float lenticularHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 1.0 : sin(iTime * 0.6) * 0.5;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.6 : cos(iTime * 0.4) * 0.3;

    float lensCount = 60.0;
    float lensPhase = floor(uv.x * lensCount);
    float lensLocal = fract(uv.x * lensCount) - 0.5;

    float viewShift = tiltX * 3.0;
    float lensAngle = lensLocal + viewShift;

    vec3 rainbow = lenticularRainbow(lensAngle * 0.5 + uv.y * 0.3 + iTime * 0.15);

    float ripple = sin(uv.y * 40.0 + iTime * 2.0 + tiltY * 10.0) * 0.5 + 0.5;
    ripple *= sin(uv.x * 30.0 - iTime * 1.5 + tiltX * 8.0) * 0.5 + 0.5;

    float securityPattern = sin(uv.x * 200.0) * sin(uv.y * 200.0);
    securityPattern = smoothstep(0.0, 0.1, securityPattern);

    float shimmer = sin(lensPhase * 0.5 + iTime * 3.0 + tiltX * 20.0);
    shimmer = pow(max(shimmer, 0.0), 4.0);

    float microLines = sin(uv.y * lensCount * 3.14159) * 0.5 + 0.5;
    microLines = pow(microLines, 0.3);

    vec3 baseColor = vec3(0.92, 0.92, 0.95);
    vec3 col = mix(baseColor, rainbow, 0.6 * ripple);
    col += shimmer * rainbow * 0.4;
    col *= 0.8 + 0.2 * microLines;
    col += securityPattern * 0.03 * rainbow;

    float fresnel = pow(1.0 - abs(dot(normalize(vec3(centered, 0.5)), vec3(0.0, 0.0, 1.0))), 3.0);
    col += fresnel * rainbow * 0.2;

    float border = smoothstep(0.0, 0.015, uv.x) * smoothstep(0.0, 0.015, uv.y) *
                   smoothstep(0.0, 0.015, 1.0 - uv.x) * smoothstep(0.0, 0.015, 1.0 - uv.y);
    col *= border;
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
