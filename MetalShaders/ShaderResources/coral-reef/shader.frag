#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float coralNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float coralFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * coralNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float coralBranch(vec2 p, float phase) {
    float branch = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = phase + fi * 1.2566;
        vec2 dir = vec2(cos(angle), sin(angle));
        float d = abs(dot(p, vec2(-dir.y, dir.x)));
        float along = dot(p, dir);
        float width = 0.02 * (1.0 - smoothstep(0.0, 0.3, along));
        branch += smoothstep(width, width * 0.3, d) * step(0.0, along) * step(along, 0.25);
    }
    return clamp(branch, 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0, 0.05, 0.15);

    float waterCaustic = coralFbm(uv * 5.0 + iTime * 0.3);
    col += vec3(0.0, 0.05, 0.1) * waterCaustic;

    for (int j = 0; j < 4; j++) {
        float fj = float(j);
        vec2 offset = vec2(sin(fj * 2.5) * 0.25, -0.2 + fj * 0.05);
        float phase = fj * 0.8 + iTime * 0.1;
        float branch = coralBranch(uv - offset, phase);

        vec3 coralColor = 0.5 + 0.5 * cos(fj * 1.5 + vec3(0.0, 1.0, 2.0) + iTime * 0.2);
        coralColor = mix(coralColor, vec3(1.0, 0.3, 0.4), 0.3);

        float sss = coralFbm((uv - offset) * 8.0 + iTime * 0.5);
        coralColor += vec3(0.2, 0.05, 0.0) * sss;

        col = mix(col, coralColor, branch * 0.8);
    }

    float light = 0.5 + 0.5 * sin(iTime * 0.8 + uv.x * 3.0);
    col += vec3(0.0, 0.02, 0.05) * light;

    fragColor = vec4(col, 1.0);
}
