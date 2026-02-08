#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float hsHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hsNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hsHash(i), hsHash(i + vec2(1, 0)), f.x),
               mix(hsHash(i + vec2(0, 1)), hsHash(i + vec2(1, 1)), f.x), f.y);
}

vec3 hsRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 1.0 : sin(iTime * 0.5) * 0.5;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.8 : cos(iTime * 0.7) * 0.4;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));

    float embossScale = 8.0;
    float starAngle = atan(centered.y, centered.x);
    float starRadius = length(centered);
    float starPattern = sin(starAngle * 5.0) * 0.5 + 0.5;
    starPattern *= smoothstep(0.5, 0.2, starRadius);
    float circlePattern = smoothstep(0.32, 0.3, starRadius) - smoothstep(0.3, 0.28, starRadius);
    float emboss = starPattern + circlePattern;

    float text1 = smoothstep(0.02, 0.0, abs(centered.y + 0.55) + abs(centered.x) * 0.3 - 0.15);
    emboss += text1 * 0.5;

    vec3 embossNormal = normalize(vec3(
        dFdx(emboss) * 15.0,
        dFdy(emboss) * 15.0,
        1.0
    ));

    float diffraction = dot(uv, viewDir.xy) * 6.0;
    diffraction += hsNoise(uv * 4.0) * 1.5;
    vec3 rainbow = hsRainbow(diffraction + iTime * 0.2);

    float pearl = 0.5 + 0.5 * sin(dot(centered, viewDir.xy) * 15.0 + iTime);
    vec3 pearlColor = mix(vec3(1.0, 0.95, 0.98), vec3(0.95, 0.98, 1.0), pearl);

    vec3 lightDir = normalize(vec3(tiltX, tiltY, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, embossNormal), viewDir), 0.0), 48.0);
    float diff = max(dot(embossNormal, lightDir), 0.0);

    float angleReveal = dot(viewDir.xy, normalize(centered + 0.001));
    float revealMask = smoothstep(0.3, 0.7, angleReveal * 0.5 + 0.5);

    vec3 col = pearlColor * (0.4 + diff * 0.4);
    col = mix(col, rainbow, 0.5);
    col += spec * vec3(1.0) * 0.6;
    col += emboss * revealMask * rainbow * 0.3;

    float stickerEdge = smoothstep(0.85, 0.83, max(abs(centered.x), abs(centered.y)));
    col *= stickerEdge;

    float peel = smoothstep(0.8, 0.75, centered.x + centered.y * 0.3 + 0.5);
    col *= 0.9 + 0.1 * peel;

    col = pow(col, vec3(0.95));
    fragColor = vec4(col, 1.0);
}
