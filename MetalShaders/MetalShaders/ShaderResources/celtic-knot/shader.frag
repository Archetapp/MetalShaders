#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ckSdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float ckSdArc(vec2 p, vec2 center, float radius, float startAngle, float endAngle) {
    vec2 rel = p - center;
    float angle = atan(rel.y, rel.x);
    float midAngle = (startAngle + endAngle) * 0.5;
    float halfSpan = (endAngle - startAngle) * 0.5;

    float diff = angle - midAngle;
    diff = diff - 6.28318 * floor((diff + 3.14159) / 6.28318);

    if (abs(diff) < halfSpan) {
        return abs(length(rel) - radius);
    }
    vec2 p1 = center + radius * vec2(cos(startAngle), sin(startAngle));
    vec2 p2 = center + radius * vec2(cos(endAngle), sin(endAngle));
    return min(length(p - p1), length(p - p2));
}

float ckKnotBand(vec2 uv, float bandWidth) {
    float scale = 3.0;
    vec2 p = uv * scale;

    vec2 cell = floor(p);
    vec2 f = fract(p) - 0.5;

    float d = 1e5;
    float cellType = mod(cell.x + cell.y, 2.0);

    float r = 0.5;
    if (cellType < 0.5) {
        d = min(d, ckSdArc(f, vec2(-0.5, -0.5), r, 0.0, 1.5708));
        d = min(d, ckSdArc(f, vec2(0.5, 0.5), r, 3.14159, 4.71239));
    } else {
        d = min(d, ckSdArc(f, vec2(0.5, -0.5), r, 1.5708, 3.14159));
        d = min(d, ckSdArc(f, vec2(-0.5, 0.5), r, 4.71239, 6.28318));
    }

    return d;
}

float ckOverUnder(vec2 uv) {
    float scale = 3.0;
    vec2 p = uv * scale;
    vec2 cell = floor(p);
    vec2 f = fract(p) - 0.5;
    float cellType = mod(cell.x + cell.y, 2.0);

    float diag;
    if (cellType < 0.5) {
        diag = f.x - f.y;
    } else {
        diag = f.x + f.y;
    }
    return diag;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float zoom = 1.5 + 0.2 * sin(iTime * 0.3);
    vec2 pan = vec2(sin(iTime * 0.1) * 0.2, cos(iTime * 0.13) * 0.2);
    uv = uv * zoom + pan;

    float bandWidth = 0.08;
    float d = ckKnotBand(uv, bandWidth);
    float overUnder = ckOverUnder(uv);

    vec3 bgColor = vec3(0.02, 0.08, 0.03);
    vec3 bgPattern = bgColor + vec3(0.01) * sin(uv.x * 50.0) * sin(uv.y * 50.0);

    float band = smoothstep(bandWidth + 0.01, bandWidth - 0.01, d);

    vec3 goldBase = vec3(0.85, 0.65, 0.13);
    vec3 goldLight = vec3(1.0, 0.9, 0.5);
    vec3 goldDark = vec3(0.5, 0.35, 0.05);

    float edgeShade = smoothstep(0.0, bandWidth, d);
    vec3 bandColor = mix(goldLight, goldBase, edgeShade);

    float depth = overUnder > 0.0 ? 1.0 : 0.6;
    bandColor *= depth;

    float borderLine = smoothstep(bandWidth - 0.015, bandWidth - 0.005, d) *
                       smoothstep(bandWidth + 0.005, bandWidth - 0.005, d);
    bandColor = mix(bandColor, goldDark, borderLine * 0.5);

    float highlight = smoothstep(bandWidth * 0.5, 0.0, d) * 0.4;
    bandColor += goldLight * highlight;

    float anim = sin(iTime * 2.0 + uv.x * 10.0 + uv.y * 10.0) * 0.05;
    bandColor += vec3(anim, anim * 0.8, 0.0);

    vec3 col = mix(bgPattern, bandColor, band);

    float outerGlow = smoothstep(bandWidth + 0.1, bandWidth, d) * (1.0 - band);
    col += vec3(0.3, 0.2, 0.05) * outerGlow * 0.3;

    col *= 1.0 - 0.3 * length(uv / zoom);

    fragColor = vec4(col, 1.0);
}
