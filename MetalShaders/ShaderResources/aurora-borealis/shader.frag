#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.15;

    vec3 skyDark = vec3(0.0, 0.02, 0.05);
    vec3 skyHorizon = vec3(0.02, 0.05, 0.1);
    vec3 sky = mix(skyHorizon, skyDark, uv.y);

    float stars = step(0.998, hash(floor(gl_FragCoord.xy * 0.5)));
    sky += stars * 0.5;

    float aurora = 0.0;
    vec3 auroraColor = vec3(0.0);

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float speed = t * (0.5 + fi * 0.3);
        float yOffset = 0.5 + fi * 0.08;

        float wave = fbm(vec2(uv.x * 3.0 + speed, fi * 5.0 + t * 0.2));
        wave += sin(uv.x * 4.0 + t * 0.5 + fi) * 0.15;

        float curtainY = yOffset + wave * 0.15;
        float dist = uv.y - curtainY;

        float curtain = exp(-dist * dist * 80.0);
        curtain *= smoothstep(0.3, 0.5, uv.y);
        curtain *= smoothstep(1.0, 0.7, uv.y);

        float detail = fbm(vec2(uv.x * 8.0 + speed * 2.0, uv.y * 4.0 + fi * 3.0));
        curtain *= 0.5 + detail * 0.8;

        vec3 c1 = vec3(0.1, 0.8, 0.3);
        vec3 c2 = vec3(0.2, 0.4, 0.9);
        vec3 c3 = vec3(0.5, 0.1, 0.6);

        float colorMix = sin(uv.x * 2.0 + t + fi * 1.5) * 0.5 + 0.5;
        vec3 curtainColor;
        if (colorMix < 0.5) {
            curtainColor = mix(c1, c2, colorMix * 2.0);
        } else {
            curtainColor = mix(c2, c3, (colorMix - 0.5) * 2.0);
        }

        float heightFade = smoothstep(curtainY - 0.1, curtainY + 0.1, uv.y);
        curtainColor = mix(curtainColor, c1, heightFade * 0.5);

        auroraColor += curtainColor * curtain * (0.5 + fi * 0.15);
    }

    vec3 col = sky + auroraColor;

    col += auroraColor * 0.2 * (1.0 - uv.y);

    fragColor = vec4(col, 1.0);
}
