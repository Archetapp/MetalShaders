#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fluidHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float fluidNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fluidHash(i);
    float b = fluidHash(i + vec2(1.0, 0.0));
    float c = fluidHash(i + vec2(0.0, 1.0));
    float d = fluidHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fluidFbm(vec2 p, int octaves) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        v += a * fluidNoise(p);
        p = rot * p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

vec2 fluidCurl(vec2 p, float t) {
    float eps = 0.01;
    float n1 = fluidFbm(p + vec2(eps, 0.0) + t * 0.1, 5);
    float n2 = fluidFbm(p - vec2(eps, 0.0) + t * 0.1, 5);
    float n3 = fluidFbm(p + vec2(0.0, eps) + t * 0.1, 5);
    float n4 = fluidFbm(p - vec2(0.0, eps) + t * 0.1, 5);
    return vec2(n3 - n4, -(n1 - n2)) / (2.0 * eps);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = iTime * 0.3;

    vec2 curl1 = fluidCurl(p * 2.0, t);
    vec2 curl2 = fluidCurl(p * 3.0 + curl1 * 0.3, t * 1.3);
    vec2 curl3 = fluidCurl(p * 1.5 + curl2 * 0.2, t * 0.7);

    vec2 advected = p + curl1 * 0.15 + curl2 * 0.1 + curl3 * 0.05;

    float pattern1 = fluidFbm(advected * 3.0 + t * 0.2, 6);
    float pattern2 = fluidFbm(advected * 4.0 - t * 0.15 + 5.0, 6);
    float pattern3 = fluidFbm(advected * 2.5 + t * 0.1 + 10.0, 6);

    vec3 color1 = vec3(0.9, 0.2, 0.4);
    vec3 color2 = vec3(0.2, 0.5, 0.9);
    vec3 color3 = vec3(0.1, 0.8, 0.6);
    vec3 color4 = vec3(0.95, 0.6, 0.1);
    vec3 color5 = vec3(0.7, 0.2, 0.9);

    float blend1 = smoothstep(0.3, 0.7, pattern1);
    float blend2 = smoothstep(0.35, 0.65, pattern2);
    float blend3 = smoothstep(0.4, 0.6, pattern3);

    vec3 col = mix(color1, color2, blend1);
    col = mix(col, color3, blend2 * 0.7);
    col = mix(col, color4, blend3 * 0.5);

    float vortexStrength = length(curl1) * 2.0;
    col = mix(col, color5, smoothstep(0.5, 2.0, vortexStrength) * 0.4);

    float detail = fluidFbm(advected * 8.0 + t * 0.3, 4);
    col += vec3(detail * 0.15);

    float luminance = dot(col, vec3(0.299, 0.587, 0.114));
    float specular = pow(max(luminance, 0.0), 4.0) * 0.3;
    col += vec3(specular);

    col = mix(col, col * col, 0.1);
    col = clamp(col, 0.0, 1.0);

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
