#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float lcNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float lcSmoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = lcNoise(i);
    float b = lcNoise(i + vec2(1.0, 0.0));
    float c = lcNoise(i + vec2(0.0, 1.0));
    float d = lcNoise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float lcFbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++) {
        val += amp * lcSmoothNoise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
    }
    return val;
}

vec3 lcEnvMap(vec3 dir) {
    float t = 0.5 + 0.5 * dir.y;
    vec3 sky = mix(vec3(0.8, 0.85, 0.9), vec3(0.2, 0.4, 0.8), t);
    float sun = max(0.0, dot(dir, normalize(vec3(1.0, 0.5, 0.3))));
    sky += vec3(1.0, 0.9, 0.7) * pow(sun, 64.0);
    sky += vec3(0.5, 0.4, 0.3) * pow(sun, 8.0);
    float grid = smoothstep(0.48, 0.5, abs(fract(dir.x * 4.0) - 0.5))
               + smoothstep(0.48, 0.5, abs(fract(dir.z * 4.0) - 0.5));
    sky = mix(sky, sky * 1.3, grid * 0.15);
    return sky;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float t = iTime * 0.4;

    vec2 warp = vec2(
        lcFbm(uv * 3.0 + vec2(t, 0.0)),
        lcFbm(uv * 3.0 + vec2(0.0, t * 1.3))
    );

    vec2 warpedUV = uv + (warp - 0.5) * 0.3;

    float height = lcFbm(warpedUV * 2.0 + t * 0.5);
    float eps = 0.005;
    float hx = lcFbm((warpedUV + vec2(eps, 0.0)) * 2.0 + t * 0.5);
    float hy = lcFbm((warpedUV + vec2(0.0, eps)) * 2.0 + t * 0.5);

    vec3 normal = normalize(vec3((height - hx) / eps, (height - hy) / eps, 1.0));

    vec3 viewDir = normalize(vec3(uv, 1.5));
    vec3 reflDir = reflect(viewDir, normal);

    vec3 envColor = lcEnvMap(reflDir);

    float fresnel = pow(1.0 - max(0.0, dot(-viewDir, normal)), 3.0);
    fresnel = mix(0.6, 1.0, fresnel);

    vec3 chrome = vec3(0.9, 0.92, 0.95);
    vec3 col = chrome * envColor * fresnel;

    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float spec = pow(max(0.0, dot(reflect(-lightDir, normal), -viewDir)), 128.0);
    col += vec3(1.0, 0.98, 0.95) * spec * 1.5;

    float rim = pow(1.0 - max(0.0, dot(-viewDir, normal)), 4.0);
    col += vec3(0.6, 0.7, 0.9) * rim * 0.4;

    col = col / (col + 1.0);
    col = pow(col, vec3(0.85));

    fragColor = vec4(col, 1.0);
}
