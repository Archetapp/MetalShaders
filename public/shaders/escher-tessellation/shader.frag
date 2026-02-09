#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float etHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 etDeform(vec2 p, float t) {
    float freq = 3.14159;
    p.x += sin(p.y * freq + t) * 0.15;
    p.y += sin(p.x * freq + t * 0.7) * 0.15;
    p.x += cos(p.y * freq * 0.5 + t * 1.3) * 0.08;
    p.y += cos(p.x * freq * 0.5 + t * 0.9) * 0.08;
    return p;
}

float etCreatureShape(vec2 p, float cellType) {
    float body = length(p) - 0.35;

    if (cellType < 0.5) {
        vec2 headP = p - vec2(0.2, 0.15);
        float head = length(headP) - 0.12;
        body = min(body, head);

        vec2 wingP1 = p - vec2(-0.15, 0.2);
        float wing1 = length(wingP1 * vec2(1.0, 2.0)) - 0.15;
        body = min(body, wing1);

        vec2 wingP2 = p - vec2(-0.15, -0.2);
        float wing2 = length(wingP2 * vec2(1.0, 2.0)) - 0.15;
        body = min(body, wing2);

        vec2 tailP = p - vec2(-0.3, 0.0);
        float tail = length(tailP * vec2(1.5, 3.0)) - 0.1;
        body = min(body, tail);
    } else {
        vec2 finP1 = p - vec2(0.1, 0.25);
        float fin1 = length(finP1 * vec2(2.0, 1.0)) - 0.12;
        body = min(body, fin1);

        vec2 finP2 = p - vec2(0.1, -0.25);
        float fin2 = length(finP2 * vec2(2.0, 1.0)) - 0.12;
        body = min(body, fin2);

        vec2 tailP = p - vec2(-0.35, 0.0);
        float tail = length(tailP * vec2(1.0, 2.5)) - 0.12;
        body = min(body, tail);
    }

    return body;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float t = iTime * 0.4;
    float scale = 2.5;
    vec2 p = uv * scale;

    vec2 deformed = etDeform(p, t);

    vec2 cell = floor(deformed + 0.5);
    vec2 f = deformed - cell;

    float cellType = mod(cell.x + cell.y, 2.0);

    float creature = etCreatureShape(f, cellType);

    vec3 col1, col2;
    float phase = sin(iTime * 0.3) * 0.5 + 0.5;
    col1 = mix(vec3(0.15, 0.35, 0.55), vec3(0.55, 0.25, 0.15), phase);
    col2 = mix(vec3(0.85, 0.75, 0.55), vec3(0.45, 0.65, 0.85), phase);

    vec3 baseColor = cellType < 0.5 ? col1 : col2;

    float shade = smoothstep(0.35, 0.0, length(f));
    baseColor *= 0.7 + 0.3 * shade;

    float bodyGrad = 1.0 - smoothstep(0.0, 0.4, length(f));
    baseColor *= 0.85 + 0.15 * bodyGrad;

    if (cellType < 0.5) {
        vec2 eyeP = f - vec2(0.22, 0.18);
        float eye = smoothstep(0.04, 0.03, length(eyeP));
        baseColor = mix(baseColor, vec3(0.0), eye);
        float eyeHighlight = smoothstep(0.02, 0.015, length(eyeP - vec2(0.01, 0.01)));
        baseColor = mix(baseColor, vec3(1.0), eyeHighlight * 0.8);
    } else {
        vec2 eyeP = f - vec2(0.15, 0.05);
        float eye = smoothstep(0.035, 0.025, length(eyeP));
        baseColor = mix(baseColor, vec3(0.0), eye);
        float eyeHighlight = smoothstep(0.015, 0.01, length(eyeP - vec2(0.008, 0.008)));
        baseColor = mix(baseColor, vec3(1.0), eyeHighlight * 0.8);
    }

    float edgeDist = abs(creature);
    float outline = smoothstep(0.02, 0.005, edgeDist);
    baseColor = mix(baseColor, vec3(0.05), outline * 0.6);

    float pattern = sin(f.x * 20.0 + f.y * 20.0 + iTime) * 0.03;
    baseColor += pattern;

    vec3 col = baseColor;
    col *= 1.0 - 0.25 * length(uv);

    fragColor = vec4(col, 1.0);
}
