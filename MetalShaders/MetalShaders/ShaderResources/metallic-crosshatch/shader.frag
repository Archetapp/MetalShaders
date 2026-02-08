#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float mcHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.4;
    float tiltY = cos(iTime * 0.7) * 0.3;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));
    vec3 lightDir = normalize(vec3(sin(iTime * 0.3), cos(iTime * 0.4), 1.0));

    float lineScale = 60.0;
    float line1 = sin((centered.x + centered.y) * lineScale) * 0.5 + 0.5;
    float line2 = sin((centered.x - centered.y) * lineScale) * 0.5 + 0.5;
    float line3 = sin(centered.x * lineScale * 1.5) * 0.5 + 0.5;
    float line4 = sin(centered.y * lineScale * 1.5) * 0.5 + 0.5;

    line1 = smoothstep(0.3, 0.7, line1);
    line2 = smoothstep(0.3, 0.7, line2);
    line3 = smoothstep(0.4, 0.6, line3);
    line4 = smoothstep(0.4, 0.6, line4);

    float crosshatch = line1 * line2 * 0.7 + line3 * line4 * 0.3;
    float depth = 0.02 * (1.0 - crosshatch);

    vec3 normal = normalize(vec3(
        dFdx(depth) * 40.0,
        dFdy(depth) * 40.0,
        1.0
    ));

    float aniso1 = pow(max(1.0 - abs(dot(normalize(vec3(1, 1, 0)), reflect(-lightDir, normal))), 0.0), 8.0);
    float aniso2 = pow(max(1.0 - abs(dot(normalize(vec3(1, -1, 0)), reflect(-lightDir, normal))), 0.0), 8.0);
    float anisoSpec = aniso1 + aniso2;

    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 32.0);
    float diff = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 metalColor = vec3(0.75, 0.73, 0.7);
    vec3 highlightColor = vec3(0.95, 0.93, 0.88);

    vec3 col = metalColor * (0.2 + diff * 0.6);
    col += anisoSpec * highlightColor * 0.3;
    col += spec * highlightColor * 0.5;
    col += fresnel * vec3(0.4, 0.42, 0.45) * 0.2;
    col *= 0.7 + 0.3 * crosshatch;

    float vignette = 1.0 - 0.3 * length(centered * 0.5);
    col *= vignette;
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
