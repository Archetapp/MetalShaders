#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float penroseSegment(vec2 p, vec2 a, vec2 b, float width) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    return smoothstep(width + 0.003, width - 0.003, d);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float rot = iTime * 0.3;
    float c = cos(rot), s = sin(rot);
    uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

    vec3 col = vec3(0.95, 0.93, 0.9);

    float size = 0.25;
    float w = 0.04;
    float h30 = 0.866;

    vec2 v0 = vec2(0.0, size);
    vec2 v1 = vec2(-size * h30, -size * 0.5);
    vec2 v2 = vec2(size * h30, -size * 0.5);

    vec2 d01 = normalize(v1 - v0);
    vec2 d12 = normalize(v2 - v1);
    vec2 d20 = normalize(v0 - v2);
    vec2 n01 = vec2(-d01.y, d01.x);
    vec2 n12 = vec2(-d12.y, d12.x);
    vec2 n20 = vec2(-d20.y, d20.x);

    float outer0 = penroseSegment(uv, v0 + n01 * w, v1 + n01 * w, 0.008);
    float inner0 = penroseSegment(uv, v0 - n01 * w, v1 - n01 * w, 0.008);
    float outer1 = penroseSegment(uv, v1 + n12 * w, v2 + n12 * w, 0.008);
    float inner1 = penroseSegment(uv, v1 - n12 * w, v2 - n12 * w, 0.008);
    float outer2 = penroseSegment(uv, v2 + n20 * w, v0 + n20 * w, 0.008);
    float inner2 = penroseSegment(uv, v2 - n20 * w, v0 - n20 * w, 0.008);

    float bar0 = penroseSegment(uv, v0, v1, w);
    float bar1 = penroseSegment(uv, v1, v2, w);
    float bar2 = penroseSegment(uv, v2, v0, w);

    float along0 = dot(uv - v0, d01) / length(v1 - v0);
    float along1 = dot(uv - v1, d12) / length(v2 - v1);
    float along2 = dot(uv - v2, d20) / length(v0 - v2);

    vec3 shade0 = mix(vec3(0.6, 0.5, 0.7), vec3(0.4, 0.3, 0.5), along0);
    vec3 shade1 = mix(vec3(0.5, 0.6, 0.7), vec3(0.3, 0.4, 0.5), along1);
    vec3 shade2 = mix(vec3(0.7, 0.5, 0.6), vec3(0.5, 0.3, 0.4), along2);

    float side0 = dot(uv - v0, n01);
    shade0 *= (side0 > 0.0) ? 1.1 : 0.85;
    float side1 = dot(uv - v1, n12);
    shade1 *= (side1 > 0.0) ? 1.1 : 0.85;
    float side2 = dot(uv - v2, n20);
    shade2 *= (side2 > 0.0) ? 1.1 : 0.85;

    col = mix(col, shade0, bar0 * 0.9);
    col = mix(col, shade1, bar1 * 0.9);
    col = mix(col, shade2, bar2 * 0.9);

    float edges = max(max(outer0, inner0), max(max(outer1, inner1), max(outer2, inner2)));
    col = mix(col, vec3(0.15), edges * 0.8);

    fragColor = vec4(col, 1.0);
}
