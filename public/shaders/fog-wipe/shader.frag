#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float fwHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float fwNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(fwHash(i), fwHash(i+vec2(1,0)), f.x), mix(fwHash(i+vec2(0,1)), fwHash(i+vec2(1,1)), f.x), f.y);
}
float fwFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * fwNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec3 scene = vec3(0.1, 0.15, 0.2);
    scene += smoothstep(-0.5, 0.5, centered.y) * vec3(0.05, 0.08, 0.1);
    float trees = smoothstep(0.0, -0.3, centered.y + sin(centered.x * 3.0) * 0.1);
    scene = mix(scene, vec3(0.05, 0.1, 0.05), trees);

    float fogDensity = fwFbm(centered * 2.0 + vec2(iTime * 0.05, 0.0));
    fogDensity += fwFbm(centered * 4.0 - vec2(iTime * 0.08, iTime * 0.02)) * 0.5;
    fogDensity = fogDensity * 0.6 + 0.3;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

    float clearMask = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float t = iMouseTime * 0.3 + fi * 1.8;
        vec2 wipePos = (i == 0 && hasInput) ? mouseCentered : vec2(sin(t * 0.7 + fi) * 0.5, cos(t * 0.5 + fi * 0.7) * 0.4);
        float wipeAge = fract(t / 5.0) * 5.0;
        float wipeRadius = 0.2 + 0.1 * sin(fi);
        float wipeClear = smoothstep(wipeRadius, wipeRadius * 0.3, length(centered - wipePos));
        float regrow = smoothstep(0.0, 4.0, wipeAge) * 0.8;
        clearMask = max(clearMask, wipeClear * (1.0 - regrow));
    }

    vec3 fogColor = vec3(0.6, 0.65, 0.7) + fwFbm(centered * 3.0 + iTime * 0.02) * 0.1;
    float finalFog = fogDensity * (1.0 - clearMask);

    vec3 col = mix(scene, fogColor, finalFog);
    float particles = pow(fwNoise(centered * 20.0 + iTime * 0.3), 6.0) * finalFog;
    col += particles * 0.2;

    fragColor = vec4(col, 1.0);
}
