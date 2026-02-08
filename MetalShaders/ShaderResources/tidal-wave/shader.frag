#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float twHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float twNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = twHash(i);
    float b = twHash(i + vec2(1.0, 0.0));
    float c = twHash(i + vec2(0.0, 1.0));
    float d = twHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float twFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * twNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float twOceanHeight(vec2 p, float t) {
    float h = 0.0;
    h += sin(p.x * 1.0 + t * 1.2) * 0.25;
    h += sin(p.x * 2.5 + p.y * 0.8 + t * 1.8) * 0.12;
    h += sin(p.x * 4.0 - p.y * 1.5 + t * 2.5) * 0.06;
    h += sin(p.y * 3.0 + p.x * 1.2 + t * 1.0) * 0.08;

    float bigWave = sin(p.x * 0.3 + t * 0.6) * 0.4;
    bigWave *= smoothstep(-0.5, 0.2, p.y);
    h += bigWave;

    float crest = pow(max(0.0, sin(p.x * 0.8 + t * 1.0)), 3.0) * 0.3;
    h += crest;

    h += twFbm(p * 3.0 + t * 0.5) * 0.05;
    h += twFbm(p * 8.0 + t * 0.3) * 0.02;

    return h;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime;

    vec2 oceanUV = uv * 3.0;
    oceanUV.y += t * 0.5;

    float perspY = uv.y - 0.1;
    float perspective = 1.0 / (perspY * 2.0 + 1.5);
    vec2 worldPos = vec2(uv.x * perspective * 5.0, perspective * 8.0);
    worldPos.y += t * 1.5;

    float skyMask = smoothstep(0.1, 0.15, uv.y);

    float h = twOceanHeight(worldPos, t);

    float eps = 0.01;
    float hx = twOceanHeight(worldPos + vec2(eps, 0.0), t);
    float hy = twOceanHeight(worldPos + vec2(0.0, eps), t);
    vec3 normal = normalize(vec3(-(hx - h) / eps * 0.3, 1.0, -(hy - h) / eps * 0.3));

    vec3 sunDir = normalize(vec3(0.3, 0.6, -0.5));
    vec3 viewDir = normalize(vec3(0.0, 0.3, -1.0));

    float diff = max(dot(normal, sunDir), 0.0);
    vec3 halfDir = normalize(sunDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 120.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    vec3 deepColor = vec3(0.0, 0.05, 0.15);
    vec3 shallowColor = vec3(0.0, 0.2, 0.3);
    vec3 foamColor = vec3(0.8, 0.85, 0.9);

    float depthFactor = smoothstep(-0.3, 0.3, h);
    vec3 waterColor = mix(deepColor, shallowColor, depthFactor);

    vec3 col = waterColor * 0.3;
    col += waterColor * diff * 0.5;
    col += vec3(1.0, 0.9, 0.7) * spec * 1.5;
    col += vec3(0.5, 0.6, 0.7) * fresnel * 0.3;

    float foam = smoothstep(0.35, 0.5, h);
    foam += smoothstep(0.9, 1.0, twFbm(worldPos * 5.0 + t * 0.8)) * 0.3;
    foam = clamp(foam, 0.0, 1.0);
    col = mix(col, foamColor, foam * 0.7);

    float sss = pow(max(0.0, dot(viewDir, -sunDir + normal * 0.5)), 3.0) * 0.15;
    col += vec3(0.0, 0.3, 0.2) * sss;

    float spray = pow(twFbm(worldPos * 10.0 + t * 2.0), 3.0) * foam * 0.3;
    col += vec3(0.9) * spray;

    vec3 skyColor = mix(vec3(0.7, 0.4, 0.3), vec3(0.2, 0.3, 0.6), smoothstep(0.1, 0.5, uv.y));
    float sunGlow = pow(max(0.0, dot(normalize(vec3(uv.x, uv.y - 0.3, 0.5)), sunDir)), 32.0);
    skyColor += vec3(1.0, 0.8, 0.5) * sunGlow;

    col = mix(skyColor, col, skyMask);

    float sunReflection = pow(max(0.0, 1.0 - length(uv - vec2(0.15, -0.1)) * 3.0), 2.0) * skyMask;
    col += vec3(1.0, 0.8, 0.5) * sunReflection * 0.3;

    col = pow(col, vec3(0.95));
    col = col * 1.05 - 0.02;
    col = clamp(col, 0.0, 1.0);

    fragColor = vec4(col, 1.0);
}
