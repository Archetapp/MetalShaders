#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float batHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float batNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(batHash(i), batHash(i + vec2(1, 0)), f.x),
               mix(batHash(i + vec2(0, 1)), batHash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.5;
    float tiltY = cos(iTime * 0.7) * 0.3;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));

    float brushNoise = batNoise(vec2(uv.x * 2.0, uv.y * 400.0)) * 0.5 +
                       batNoise(vec2(uv.x * 4.0, uv.y * 800.0)) * 0.3 +
                       batNoise(vec2(uv.x * 8.0, uv.y * 1600.0)) * 0.2;

    vec3 brushDir = normalize(vec3(0.0, 1.0, 0.0));
    vec3 tangent = normalize(vec3(1.0, 0.0, 0.0));
    vec3 normal = normalize(vec3(
        (brushNoise - 0.5) * 0.15,
        0.0,
        1.0
    ));

    vec3 lightDir = normalize(vec3(sin(iTime * 0.3) * 0.5, 0.8, 1.0));

    vec3 halfVec = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVec), 0.0);
    float TdotH = dot(tangent, halfVec);

    float anisoSpec = exp(-TdotH * TdotH * 2.0) * pow(NdotH, 8.0);
    float broadSpec = pow(NdotH, 16.0);
    float tightSpec = pow(NdotH, 128.0);

    float diff = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 5.0);

    float microGroove = sin(uv.y * 500.0 + brushNoise * 10.0) * 0.5 + 0.5;
    microGroove = pow(microGroove, 0.5);

    vec3 aluminumBase = vec3(0.78, 0.78, 0.80);
    vec3 aluminumHighlight = vec3(0.95, 0.95, 0.97);

    vec3 col = aluminumBase * (0.3 + diff * 0.5);
    col += anisoSpec * aluminumHighlight * 0.6;
    col += broadSpec * aluminumHighlight * 0.2;
    col += tightSpec * vec3(1.0) * 0.4;
    col += fresnel * vec3(0.9, 0.9, 0.92) * 0.15;
    col *= 0.85 + 0.15 * microGroove;
    col *= 0.9 + 0.1 * brushNoise;

    float vignette = 1.0 - 0.2 * length(centered * 0.4);
    col *= vignette;
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
