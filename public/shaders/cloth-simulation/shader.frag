#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float csWave(vec2 p, float freq, float speed, vec2 dir, float t) {
    return sin(dot(p, dir) * freq + t * speed);
}

float csHeight(vec2 p, float t, vec2 pinch1Pos) {
    float h = 0.0;
    h += csWave(p, 3.0, 1.2, vec2(1.0, 0.3), t) * 0.15;
    h += csWave(p, 5.0, 1.8, vec2(0.7, 1.0), t) * 0.08;
    h += csWave(p, 8.0, 2.5, vec2(-0.5, 0.8), t) * 0.04;
    h += csWave(p, 12.0, 3.0, vec2(1.0, -0.6), t) * 0.025;
    h += csWave(p, 2.0, 0.8, vec2(0.3, 1.0), t) * 0.2;
    h += csWave(p, 1.5, 0.5, vec2(1.0, 0.0), t) * 0.12;

    float pinch1 = exp(-length(p - pinch1Pos) * 3.0) * 0.15;
    float pinch2 = exp(-length(p - vec2(0.8, -0.8)) * 3.0) * 0.15;
    float pinch3 = exp(-length(p - vec2(0.0, 0.8)) * 2.0) * 0.1;
    h += pinch1 + pinch2 + pinch3;

    float fold = sin(p.x * 6.0 + sin(p.y * 3.0 + t) * 0.5) * 0.03;
    h += fold;

    return h;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);
    vec2 pinch1Pos = hasInput ? mouseCentered : vec2(-0.8, -0.8);
    float t = iTime;

    float h = csHeight(uv, t, pinch1Pos);

    float eps = 0.005;
    float hx = csHeight(uv + vec2(eps, 0.0), t, pinch1Pos);
    float hy = csHeight(uv + vec2(0.0, eps), t, pinch1Pos);
    vec3 normal = normalize(vec3(-(hx - h) / eps, -(hy - h) / eps, 1.0));

    vec3 lightPos1 = vec3(0.5, 0.8, 1.5);
    vec3 lightPos2 = vec3(-0.7, 0.3, 1.0);
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));

    vec3 lightDir1 = normalize(lightPos1 - vec3(uv, h));
    vec3 lightDir2 = normalize(lightPos2 - vec3(uv, h));

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    vec3 halfVec1 = normalize(lightDir1 + viewDir);
    vec3 halfVec2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfVec1), 0.0), 80.0);
    float spec2 = pow(max(dot(normal, halfVec2), 0.0), 60.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 warpUV = vec3(uv + normal.xy * 0.05, 0.0);
    float thread1 = sin(warpUV.x * 80.0) * 0.5 + 0.5;
    float thread2 = sin(warpUV.y * 80.0) * 0.5 + 0.5;
    float weave = mix(thread1, thread2, 0.5) * 0.08 + 0.92;

    vec3 silkColor1 = vec3(0.6, 0.15, 0.2);
    vec3 silkColor2 = vec3(0.7, 0.2, 0.25);
    float colorShift = dot(normal, viewDir) * 0.5 + 0.5;
    vec3 baseColor = mix(silkColor1, silkColor2, colorShift) * weave;

    vec3 col = baseColor * 0.15;
    col += baseColor * diff1 * 0.6;
    col += baseColor * diff2 * 0.3 * vec3(0.9, 0.9, 1.0);
    col += vec3(1.0, 0.95, 0.9) * spec1 * 0.7;
    col += vec3(0.9, 0.92, 1.0) * spec2 * 0.4;
    col += vec3(0.8, 0.3, 0.35) * fresnel * 0.2;

    float ao = smoothstep(-0.2, 0.1, h) * 0.3 + 0.7;
    col *= ao;

    float shadow = smoothstep(0.0, -0.15, h) * 0.3;
    col *= (1.0 - shadow);

    col = pow(col, vec3(0.95));
    col = col * 1.1 - 0.05;
    col = clamp(col, 0.0, 1.0);

    fragColor = vec4(col, 1.0);
}
