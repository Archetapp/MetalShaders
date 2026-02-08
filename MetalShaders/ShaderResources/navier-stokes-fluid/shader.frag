#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float nsHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float nsNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(nsHash(i), nsHash(i+vec2(1,0)), f.x), mix(nsHash(i+vec2(0,1)), nsHash(i+vec2(1,1)), f.x), f.y);
}

vec2 nsVelocityField(vec2 p, float t) {
    float n1 = nsNoise(p * 2.0 + t * 0.3);
    float n2 = nsNoise(p * 2.0 + t * 0.3 + 100.0);
    vec2 curl = vec2(nsNoise(p * 3.0 + vec2(0.0, 0.01) + t * 0.2) - nsNoise(p * 3.0 - vec2(0.0, 0.01) + t * 0.2),
                     -(nsNoise(p * 3.0 + vec2(0.01, 0.0) + t * 0.2) - nsNoise(p * 3.0 - vec2(0.01, 0.0) + t * 0.2)));
    return curl * 2.0 + vec2(sin(t * 0.5 + p.y * 3.0), cos(t * 0.4 + p.x * 2.5)) * 0.3;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 advectedUv = uv;
    for (int i = 0; i < 5; i++) {
        vec2 vel = nsVelocityField(advectedUv, iTime - float(i) * 0.05);
        advectedUv -= vel * 0.02;
    }

    vec3 dye = vec3(0.0);
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 injectionPoint = vec2(sin(iTime * 0.3 + fi * 1.57) * 0.25,
                                   cos(iTime * 0.4 + fi * 1.57) * 0.2);
        float dist = length(advectedUv - injectionPoint);
        float injection = exp(-dist * dist * 50.0);
        vec3 dyeColor = 0.5 + 0.5 * cos(6.28 * (fi * 0.25 + iTime * 0.1 + vec3(0.0, 0.33, 0.67)));
        dye += dyeColor * injection;
    }

    vec2 vel = nsVelocityField(uv, iTime);
    float vorticity = length(vel) * 2.0;
    float turbulence = nsNoise(advectedUv * 8.0 + iTime * 0.5) * 0.3;

    vec3 col = dye;
    col += turbulence * vec3(0.05, 0.05, 0.08);
    float wisps = nsNoise(advectedUv * 15.0 + iTime * 0.3);
    wisps = pow(wisps, 3.0) * 0.2;
    col += wisps * vec3(0.3, 0.4, 0.5);

    col *= 0.8 + 0.2 * vorticity;
    col = pow(max(col, 0.0), vec3(0.85));

    fragColor = vec4(col, 1.0);
}
