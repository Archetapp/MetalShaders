#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rgN21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

vec3 rgBackground(vec2 uv) {
    float t = iTime * 0.1;
    vec3 top = vec3(0.1, 0.15, 0.3);
    vec3 bot = vec3(0.3, 0.25, 0.15);
    vec3 col = mix(bot, top, uv.y * 0.5 + 0.5);

    float lights = 0.0;
    for (float i = 0.0; i < 8.0; i++) {
        vec2 lp = vec2(
            sin(i * 1.5 + t) * 0.3 + 0.5,
            cos(i * 2.3 + t * 0.7) * 0.2 + 0.5
        );
        float d = length(uv - lp);
        vec3 lc = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + i * 0.8);
        lights += 0.01 / (d * d + 0.01);
        col += lc * 0.003 / (d * d + 0.01);
    }
    col = mix(col, col * 1.2, lights * 0.05);
    return col * 0.6;
}

vec2 rgDropLayer(vec2 uv, float t, float size) {
    vec2 aspect = vec2(2.0, 1.0);
    vec2 uvScaled = uv * size * aspect;

    uvScaled.y += t * 0.75;
    vec2 gv = fract(uvScaled) - 0.5;
    vec2 id = floor(uvScaled);

    float n = rgN21(id);
    t += n * 6.28;

    float w = uv.y * 10.0;
    float x = (n - 0.5) * 0.8;
    x += (0.4 - abs(x)) * sin(3.0 * w) * pow(sin(w), 6.0) * 0.45;
    float y = -sin(t + sin(t + sin(t) * 0.5)) * 0.45;
    y -= (gv.x - x) * (gv.x - x);

    vec2 dropPos = (gv - vec2(x, y)) / aspect;
    float drop = smoothstep(0.05, 0.03, length(dropPos));

    vec2 trailPos = (gv - vec2(x, t * 0.25)) / aspect;
    trailPos.y = (fract(trailPos.y * 8.0) - 0.5) / 8.0;
    float trail = smoothstep(0.03, 0.01, length(trailPos));
    float fogTrail = smoothstep(-0.05, 0.05, dropPos.y);
    fogTrail *= smoothstep(0.5, y, gv.y);
    trail *= fogTrail;
    fogTrail *= smoothstep(0.05, 0.04, abs(dropPos.x));

    vec2 offs = drop * dropPos * 30.0 + trail * trailPos * 30.0;
    return offs;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 uvCentered = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

    float t = iTime;

    vec2 offs = vec2(0.0);
    offs += rgDropLayer(uvCentered, t, 40.0);
    offs += rgDropLayer(uvCentered * 1.23 + 3.12, t * 0.8, 25.0);
    offs += rgDropLayer(uvCentered * 0.9 + 7.51, t * 1.2, 60.0) * 0.5;

    vec2 distortedUV = uv + offs * 0.01;
    vec3 col = rgBackground(distortedUV);

    float fog = smoothstep(0.0, 0.5, length(offs));
    col = mix(col, col * 0.7 + 0.1, 0.3 - fog * 0.2);

    float vig = 1.0 - 0.3 * dot(uvCentered, uvCentered);
    col *= vig;

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
