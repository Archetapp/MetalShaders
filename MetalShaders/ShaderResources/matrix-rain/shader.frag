#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float character(vec2 uv, float charId) {
    uv = clamp(uv, 0.0, 1.0);

    float cols = 5.0;
    float rows = 7.0;
    vec2 grid = floor(vec2(uv.x * cols, uv.y * rows));
    float idx = grid.y * cols + grid.x;

    float pattern = step(0.45, hash(vec2(idx, charId)));

    float edgeMask = step(0.1, uv.x) * step(uv.x, 0.9) *
                     step(0.05, uv.y) * step(uv.y, 0.95);

    return pattern * edgeMask;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;

    float charSize = 14.0;
    float columns = floor(iResolution.x / charSize);
    float rows = floor(iResolution.y / charSize);

    vec2 cellCoord = floor(gl_FragCoord.xy / charSize);
    vec2 cellUV = fract(gl_FragCoord.xy / charSize);

    float colId = cellCoord.x;
    float rowId = cellCoord.y;

    float speed = 3.0 + hash(vec2(colId, 0.0)) * 8.0;
    float offset = hash(vec2(colId, 1.0)) * rows;

    float rainPos = mod(t * speed + offset, rows + 20.0);
    float rowFromTop = rows - rowId;
    float distFromHead = rowFromTop - rainPos;

    float trailLength = 15.0 + hash(vec2(colId, 2.0)) * 10.0;

    float brightness = 0.0;
    if (distFromHead >= 0.0 && distFromHead < trailLength) {
        brightness = 1.0 - distFromHead / trailLength;
        brightness = pow(brightness, 1.5);
    }

    float isHead = smoothstep(1.0, 0.0, abs(distFromHead));

    float charSpeed = floor(t * 10.0);
    float charId = hash(vec2(colId, rowId + charSpeed * 0.1));
    float slowChange = hash(vec2(colId, rowId + floor(t * 2.0)));
    charId = mix(charId, slowChange, 0.5);

    float ch = character(cellUV, charId * 100.0);

    vec3 col = vec3(0.0);

    vec3 greenTrail = vec3(0.0, 0.6, 0.1) * brightness * ch;
    vec3 whiteHead = vec3(0.7, 1.0, 0.8) * isHead * ch;

    col += greenTrail;
    col += whiteHead;

    col += vec3(0.0, 0.05, 0.0) * brightness * 0.5;

    fragColor = vec4(col, 1.0);
}
