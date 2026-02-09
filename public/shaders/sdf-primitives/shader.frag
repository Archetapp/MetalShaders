#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
}

float sdStar(vec2 p, float r, int n, float m) {
    float an = 3.141593 / float(n);
    float en = 3.141593 / m;
    vec2 acs = vec2(cos(an), sin(an));
    vec2 ecs = vec2(cos(en), sin(en));
    float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
    p = length(p) * vec2(cos(bn), abs(sin(bn)));
    p -= r * acs;
    p += ecs * clamp(-dot(p, ecs), 0.0, r * acs.y / ecs.y);
    return length(p) * sign(p.x);
}

float sdHeart(vec2 p) {
    p.x = abs(p.x);
    if (p.y + p.x > 1.0) {
        return sqrt(dot(p - vec2(0.25, 0.75), p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
    }
    return sqrt(min(dot(p - vec2(0.0, 1.0), p - vec2(0.0, 1.0)),
                    dot(p - 0.5 * max(p.x + p.y, 0.0), p - 0.5 * max(p.x + p.y, 0.0)))) *
           sign(p.x - p.y);
}

vec3 renderShape(float d, vec3 shapeColor) {
    float edge = smoothstep(0.01, 0.0, abs(d)) * 0.8;
    float fill = smoothstep(0.01, -0.01, d);
    float glow = exp(-abs(d) * 40.0) * 0.5;
    vec3 col = shapeColor * fill * 0.6;
    col += shapeColor * edge;
    col += shapeColor * glow * 0.3;
    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    vec3 col = vec3(0.02, 0.02, 0.04);

    float morphT = fract(t * 0.2);
    int shapeA = int(mod(floor(t * 0.2), 5.0));
    int shapeB = int(mod(floor(t * 0.2) + 1.0, 5.0));

    float dA, dB;
    vec3 colA, colB;

    float pulse = sin(t * 2.0) * 0.02;
    float r = 0.25 + pulse;
    float rot = t * 0.3;
    mat2 rm = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    vec2 p = rm * uv;

    if (shapeA == 0) { dA = sdCircle(p, r); colA = vec3(0.3, 0.6, 1.0); }
    else if (shapeA == 1) { dA = sdBox(p, vec2(r * 0.8)); colA = vec3(1.0, 0.4, 0.3); }
    else if (shapeA == 2) { dA = sdTriangle(p, r); colA = vec3(0.3, 1.0, 0.5); }
    else if (shapeA == 3) { dA = sdStar(p, r * 0.9, 5, 2.5); colA = vec3(1.0, 0.8, 0.2); }
    else { dA = sdHeart(p * 3.5) / 3.5; colA = vec3(1.0, 0.3, 0.5); }

    if (shapeB == 0) { dB = sdCircle(p, r); colB = vec3(0.3, 0.6, 1.0); }
    else if (shapeB == 1) { dB = sdBox(p, vec2(r * 0.8)); colB = vec3(1.0, 0.4, 0.3); }
    else if (shapeB == 2) { dB = sdTriangle(p, r); colB = vec3(0.3, 1.0, 0.5); }
    else if (shapeB == 3) { dB = sdStar(p, r * 0.9, 5, 2.5); colB = vec3(1.0, 0.8, 0.2); }
    else { dB = sdHeart(p * 3.5) / 3.5; colB = vec3(1.0, 0.3, 0.5); }

    float smooth_t = smoothstep(0.0, 1.0, morphT);
    float d = mix(dA, dB, smooth_t);
    vec3 shapeCol = mix(colA, colB, smooth_t);

    col += renderShape(d, shapeCol);

    fragColor = vec4(col, 1.0);
}
