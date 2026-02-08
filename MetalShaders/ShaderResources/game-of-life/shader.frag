#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float cell(vec2 coord, float generation) {
    float cellSize = 6.0;
    vec2 cellCoord = floor(coord / cellSize);

    float state = step(0.55, hash(cellCoord + generation * 0.01));

    int neighbors = 0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            if (x == 0 && y == 0) continue;
            vec2 neighbor = cellCoord + vec2(float(x), float(y));
            float nState = step(0.55, hash(neighbor + generation * 0.01));
            neighbors += int(nState);
        }
    }

    float alive;
    if (state > 0.5) {
        alive = (neighbors == 2 || neighbors == 3) ? 1.0 : 0.0;
    } else {
        alive = (neighbors == 3) ? 1.0 : 0.0;
    }

    return alive;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;

    float cellSize = 6.0;
    vec2 cellCoord = floor(gl_FragCoord.xy / cellSize);
    vec2 cellUV = fract(gl_FragCoord.xy / cellSize);

    float gen = floor(t * 8.0);

    float current = cell(gl_FragCoord.xy, gen);
    float prev = cell(gl_FragCoord.xy, gen - 1.0);

    float transition = fract(t * 8.0);

    float born = current * (1.0 - prev);
    float dying = (1.0 - current) * prev;
    float stable = current * prev;

    float brightness = stable + born * transition + dying * (1.0 - transition);

    float border = smoothstep(0.0, 0.1, cellUV.x) * smoothstep(0.0, 0.1, cellUV.y)
                 * smoothstep(0.0, 0.1, 1.0 - cellUV.x) * smoothstep(0.0, 0.1, 1.0 - cellUV.y);

    vec3 aliveColor = vec3(0.2, 0.8, 0.4);
    vec3 deadColor = vec3(0.02, 0.04, 0.03);
    vec3 birthColor = vec3(0.4, 1.0, 0.6);
    vec3 deathColor = vec3(0.6, 0.2, 0.1);

    vec3 col = deadColor;
    col = mix(col, aliveColor, stable * border);
    col = mix(col, birthColor, born * transition * border);
    col = mix(col, deathColor, dying * (1.0 - transition) * border * 0.5);

    col += vec3(0.0, 0.02, 0.01) * border * (1.0 - brightness) * 0.5;

    fragColor = vec4(col, 1.0);
}
