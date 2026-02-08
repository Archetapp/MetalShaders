#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform float iMouseDown;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float svHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float svNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(svHash(i), svHash(i+vec2(1,0)), f.x), mix(svHash(i+vec2(0,1)), svHash(i+vec2(1,1)), f.x), f.y);
}
float svFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * svNoise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    bool isInteracting = iMouseDown > 0.5;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);

    vec3 col = vec3(0.02, 0.02, 0.03);

    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 sourcePos = (i == 0 && isInteracting) ? mouseCentered : vec2((fi - 1.0) * 0.2, -0.4);
        vec2 smokeUv = uv - sourcePos;
        smokeUv.x += sin(smokeUv.y * 3.0 + iTime * 0.5 + fi) * 0.1 * (smokeUv.y + 0.4);
        smokeUv.x *= 1.0 / (1.0 + (smokeUv.y + 0.4) * 0.8);

        float height = smokeUv.y + 0.4;
        if (height > 0.0) {
            float density = svFbm(vec2(smokeUv.x * 4.0, smokeUv.y * 2.0 - iTime * 0.3 + fi * 10.0));
            density += svFbm(vec2(smokeUv.x * 8.0 + iTime * 0.1, smokeUv.y * 4.0 - iTime * 0.5 + fi * 20.0)) * 0.5;
            density *= exp(-abs(smokeUv.x) * 4.0);
            density *= exp(-height * 1.5);
            density *= smoothstep(0.0, 0.1, height);
            density = max(density - 0.2, 0.0) * 1.5;

            vec3 smokeColor = mix(vec3(0.4, 0.4, 0.45), vec3(0.25, 0.25, 0.3), height);
            float backlight = exp(-height * 2.0) * 0.3;
            smokeColor += vec3(0.3, 0.2, 0.1) * backlight;

            col = mix(col, smokeColor, density * 0.6);
        }
    }

    float ambientSmoke = svFbm(uv * 3.0 + iTime * 0.02) * 0.05;
    col += ambientSmoke * vec3(0.2, 0.2, 0.25);

    fragColor = vec4(col, 1.0);
}
