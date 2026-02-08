#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float foilHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float foilNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = foilHash(i);
    float b = foilHash(i + vec2(1.0, 0.0));
    float c = foilHash(i + vec2(0.0, 1.0));
    float d = foilHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 foilIridescence(float angle, float thickness) {
    float phase = thickness * cos(angle) * 12.0;
    return 0.5 + 0.5 * cos(vec3(0.0, 2.094, 4.189) + phase);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.6) * 0.4;
    float tiltY = cos(iTime * 0.8) * 0.3;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));

    float thickness = 0.5 + 0.3 * foilNoise(uv * 3.0 + iTime * 0.05);
    float viewAngle = dot(normalize(vec3(centered, 0.0)), viewDir);

    vec3 iridColor = foilIridescence(viewAngle, thickness);

    float stampPattern = smoothstep(0.4, 0.38, abs(centered.x)) *
                         smoothstep(0.6, 0.58, abs(centered.y));
    float borderStamp = smoothstep(0.35, 0.34, abs(centered.x)) *
                        smoothstep(0.55, 0.54, abs(centered.y));
    borderStamp = max(stampPattern - borderStamp, 0.0);
    float emboss = stampPattern + borderStamp * 0.5;

    vec3 normal = normalize(vec3(
        dFdx(emboss) * 20.0,
        dFdy(emboss) * 20.0,
        1.0
    ));

    vec3 lightDir = normalize(vec3(tiltX * 2.0, tiltY * 2.0, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 64.0);
    float diff = max(dot(normal, lightDir), 0.0);

    float flakeScale = 80.0;
    vec2 flakeUv = floor(uv * flakeScale);
    float flakeAngle = foilHash(flakeUv) * 6.2832;
    vec3 flakeNormal = normalize(vec3(cos(flakeAngle) * 0.3, sin(flakeAngle) * 0.3, 1.0));
    float flakeSpec = pow(max(dot(reflect(-lightDir, flakeNormal), viewDir), 0.0), 128.0);
    float flakeIntensity = flakeSpec * (0.5 + 0.5 * foilHash(flakeUv + 42.0));

    vec3 metalBase = vec3(0.85, 0.82, 0.75);
    vec3 col = metalBase * (0.3 + diff * 0.7);
    col = mix(col, iridColor, 0.4 * emboss);
    col += spec * vec3(1.0, 0.95, 0.9) * 0.8;
    col += flakeIntensity * vec3(1.0, 0.98, 0.95) * emboss;

    float vignette = 1.0 - 0.3 * length(centered * 0.5);
    col *= vignette;
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
