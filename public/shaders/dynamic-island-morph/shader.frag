#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);
    vec2 islandOffset = hasInput ? mouseCentered : vec2(0.0);

    float phase = mod(iTime * 0.5, 4.0);
    float expand = smoothstep(0.0, 1.0, phase) - smoothstep(2.0, 3.0, phase);
    float split = smoothstep(1.0, 2.0, phase) - smoothstep(3.0, 4.0, phase);

    float separation = split * 0.2;
    vec2 pos1 = vec2(-separation, 0.0) + islandOffset;
    vec2 pos2 = vec2(separation, 0.0) + islandOffset;

    float w1 = 0.12 + expand * 0.08;
    float h1 = 0.04 + expand * 0.02;
    float w2 = 0.06 + split * 0.04;
    float h2 = 0.04;

    float r1 = h1;
    vec2 d1 = abs(uv - pos1) - vec2(w1 - r1, 0.0);
    float sdf1 = length(max(d1, 0.0)) + min(max(d1.x, d1.y), 0.0) - r1;

    float r2 = h2;
    vec2 d2 = abs(uv - pos2) - vec2(w2 - r2, 0.0);
    float sdf2 = length(max(d2, 0.0)) + min(max(d2.x, d2.y), 0.0) - r2;

    float k = 0.05;
    float h = clamp(0.5 + 0.5 * (sdf2 - sdf1) / k, 0.0, 1.0);
    float sdf = mix(sdf2, sdf1, h) - k * h * (1.0 - h);

    float mask = smoothstep(0.003, -0.003, sdf);
    float edge = smoothstep(-0.003, 0.0, sdf) - smoothstep(0.0, 0.003, sdf);

    vec3 islandColor = vec3(0.1, 0.1, 0.12);
    float gloss = pow(max(0.0, 1.0 - abs(uv.y) / 0.06), 2.0) * 0.15;
    islandColor += gloss;

    float indicator = smoothstep(0.008, 0.005, length(uv - pos1 - vec2(w1 * 0.6, 0.0)));
    islandColor = mix(islandColor, vec3(0.2, 0.8, 0.3), indicator);

    float camera = smoothstep(0.012, 0.01, length(uv - pos2 + vec2(w2 * 0.3, 0.0)));
    float cameraInner = smoothstep(0.008, 0.006, length(uv - pos2 + vec2(w2 * 0.3, 0.0)));
    islandColor = mix(islandColor, vec3(0.05, 0.05, 0.08), camera);
    islandColor = mix(islandColor, vec3(0.15, 0.15, 0.2), cameraInner);

    vec3 bg = vec3(0.95, 0.93, 0.9);
    vec3 col = mix(bg, islandColor, mask);

    float shadow = smoothstep(0.02, -0.01, sdf) * 0.1;
    col *= 1.0 - shadow * (1.0 - mask);

    fragColor = vec4(col, 1.0);
}
