#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    uv *= 5.0;

    vec2 cellId = floor(uv);
    vec2 cellUv = fract(uv);

    float minDist = 1.0;
    vec2 closestPoint;
    vec2 closestCell;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash(cellId + neighbor);
            point = 0.5 + 0.5 * sin(iTime * 0.6 + 6.2831 * point);

            float dist = length(neighbor + point - cellUv);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
                closestCell = cellId + neighbor;
            }
        }
    }

    vec3 cellColor = 0.5 + 0.5 * cos(
        6.2831 * hash(closestCell).x + vec3(0.0, 1.0, 2.0)
    );

    float edge = smoothstep(0.0, 0.05, minDist);
    vec3 col = cellColor * edge;

    col += (1.0 - edge) * vec3(0.95);

    fragColor = vec4(col, 1.0);
}
