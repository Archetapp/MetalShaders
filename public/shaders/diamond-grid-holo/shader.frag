#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float dgHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 dgRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 1.2 : sin(iTime * 0.5) * 0.6;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.8 : cos(iTime * 0.7) * 0.4;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));
    vec3 lightDir = hasInput ? normalize(vec3(tiltX * 0.5, tiltY * 0.5, 1.2)) : normalize(vec3(sin(iTime * 0.3), cos(iTime * 0.4), 1.2));

    float gridScale = 20.0;
    vec2 rotUv = vec2(uv.x + uv.y, uv.x - uv.y) * gridScale;
    vec2 cellId = floor(rotUv);
    vec2 cellUv = fract(rotUv) - 0.5;

    float facetAngleX = (dgHash(cellId) - 0.5) * 0.6;
    float facetAngleY = (dgHash(cellId + 100.0) - 0.5) * 0.6;
    vec3 facetNormal = normalize(vec3(facetAngleX, facetAngleY, 1.0));

    float spec = pow(max(dot(reflect(-lightDir, facetNormal), viewDir), 0.0), 96.0);
    float diff = max(dot(facetNormal, lightDir), 0.0);

    float diffraction = dot(cellId, viewDir.xy) * 0.15 + length(cellId) * 0.05;
    vec3 holoColor = dgRainbow(diffraction + iTime * 0.2);

    float edge = smoothstep(0.5, 0.45, abs(cellUv.x)) * smoothstep(0.5, 0.45, abs(cellUv.y));
    float edgeLine = 1.0 - smoothstep(0.42, 0.5, max(abs(cellUv.x), abs(cellUv.y)));

    vec3 baseColor = vec3(0.9, 0.9, 0.92);
    vec3 col = baseColor * (0.3 + diff * 0.5);
    col = mix(col, holoColor, 0.5 * edge);
    col += spec * vec3(1.0) * 1.5 * edge;
    col += edgeLine * 0.05;

    float borderMask = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, uv.y) *
                       smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.y);
    col *= borderMask;
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
