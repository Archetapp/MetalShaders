#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec4 hgHexCoord(vec2 uv) {
    vec2 r = vec2(1.0, 1.732);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    vec2 gv;
    if (length(a) < length(b))
        gv = a;
    else
        gv = b;
    vec2 id = uv - gv;
    return vec4(gv.x, gv.y, id.x, id.y);
}

float hgHexDist(vec2 p) {
    p = abs(p);
    float d = dot(p, normalize(vec2(1.0, 1.732)));
    return max(d, p.x);
}

vec3 hgPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    uv *= 8.0;

    vec4 hex = hgHexCoord(uv);
    vec2 gv = hex.xy;
    vec2 id = hex.zw;

    float d = hgHexDist(gv);
    float cellDist = length(id);

    float wave = sin(cellDist * 0.8 - t * 2.0) * 0.5 + 0.5;
    float wave2 = sin(cellDist * 0.5 - t * 1.5 + 3.14) * 0.5 + 0.5;

    float pulse = pow(wave, 3.0);

    float edge = smoothstep(0.45, 0.4, d);
    float edgeGlow = smoothstep(0.48, 0.42, d) - smoothstep(0.42, 0.36, d);

    float cellHash = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
    float cellPulse = sin(t * 2.0 + cellHash * 6.28) * 0.5 + 0.5;

    vec3 baseColor = hgPalette(cellDist * 0.1 + t * 0.1);
    vec3 edgeColor = hgPalette(cellDist * 0.1 + t * 0.1 + 0.5);

    vec3 col = vec3(0.02);
    col += baseColor * edge * pulse * 0.6;
    col += baseColor * cellPulse * edge * 0.2;
    col += edgeColor * edgeGlow * 1.5;

    float center = exp(-length(gv) * 6.0);
    col += baseColor * center * wave2 * 0.8;

    float innerGlow = smoothstep(0.3, 0.0, d) * pulse;
    col += baseColor * innerGlow * 0.3;

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
