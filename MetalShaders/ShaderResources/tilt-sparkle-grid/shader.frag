#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float tsgHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 tsgHash2(vec2 p) {
    return vec2(tsgHash(p), tsgHash(p + vec2(37.0, 91.0)));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.7) * 0.5;
    float tiltY = cos(iTime * 0.5) * 0.4;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));
    vec3 lightDir = normalize(vec3(sin(iTime * 0.3) * 0.8, cos(iTime * 0.4) * 0.6, 1.0));

    float gridSize = 40.0;
    vec2 gridUv = uv * gridSize;
    vec2 cellId = floor(gridUv);
    vec2 cellLocal = fract(gridUv) - 0.5;

    vec2 facetAngles = (tsgHash2(cellId) - 0.5) * 1.2;
    vec3 facetNormal = normalize(vec3(facetAngles, 1.0));

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(facetNormal, halfVec), 0.0), 256.0);

    float sparkleSize = 0.15 + tsgHash(cellId + 200.0) * 0.2;
    float pointMask = smoothstep(sparkleSize, sparkleSize * 0.5, length(cellLocal));

    float twinkle = sin(iTime * (2.0 + tsgHash(cellId + 300.0) * 4.0) + tsgHash(cellId) * 6.28) * 0.5 + 0.5;
    twinkle = pow(twinkle, 3.0);

    float starShape = max(
        abs(cellLocal.x * 0.7 + cellLocal.y * 0.7),
        abs(cellLocal.x * 0.7 - cellLocal.y * 0.7)
    );
    float starMask = smoothstep(sparkleSize, sparkleSize * 0.3, starShape);

    float hue = tsgHash(cellId + 500.0);
    vec3 sparkleColor = 0.5 + 0.5 * cos(6.28 * (hue + vec3(0.0, 0.33, 0.67)));
    sparkleColor = mix(vec3(1.0), sparkleColor, 0.4);

    vec3 baseColor = vec3(0.05, 0.05, 0.08);
    float sparkleIntensity = spec * pointMask * twinkle * 3.0 + starMask * spec * 0.5;
    vec3 col = baseColor + sparkleColor * sparkleIntensity;

    float glow = exp(-length(cellLocal) * 6.0) * spec * twinkle * 0.5;
    col += sparkleColor * glow;

    col = pow(col, vec3(0.9));
    fragColor = vec4(col, 1.0);
}
