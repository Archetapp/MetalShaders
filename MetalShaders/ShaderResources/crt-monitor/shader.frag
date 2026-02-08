#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 crtBarrelDistortion(vec2 uv, float amount) {
    vec2 cc = uv - 0.5;
    float dist = dot(cc, cc);
    return uv + cc * dist * amount;
}

vec3 crtContent(vec2 uv, float t) {
    vec3 col = vec3(0.0);

    float bars = sin(uv.x * 6.28 * 4.0) * 0.5 + 0.5;
    vec3 barColor = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + uv.x * 6.0 + t);
    col += barColor * bars * 0.3;

    float wave = sin(uv.y * 20.0 + t * 3.0 + sin(uv.x * 10.0 + t) * 2.0) * 0.5 + 0.5;
    col += vec3(0.2, 0.8, 0.4) * wave * 0.3;

    float circle = smoothstep(0.22, 0.2, length(uv - vec2(0.5 + sin(t) * 0.2, 0.5 + cos(t * 0.7) * 0.15)));
    col += vec3(0.9, 0.3, 0.1) * circle;

    float text = step(0.5, fract(uv.x * 40.0)) * step(0.5, fract(uv.y * 25.0));
    float textMask = smoothstep(0.1, 0.15, uv.y) * smoothstep(0.9, 0.85, uv.y);
    col += vec3(0.1, 0.9, 0.2) * text * textMask * 0.1;

    return clamp(col, 0.0, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;

    vec2 crtUV = crtBarrelDistortion(uv, 0.15);

    float border = step(0.0, crtUV.x) * step(crtUV.x, 1.0) * step(0.0, crtUV.y) * step(crtUV.y, 1.0);

    vec3 col = crtContent(crtUV, t);

    float bleed = 0.003;
    vec3 bleedCol;
    bleedCol.r = crtContent(crtUV + vec2(bleed, 0.0), t).r;
    bleedCol.g = col.g;
    bleedCol.b = crtContent(crtUV - vec2(bleed, 0.0), t).b;
    col = mix(col, bleedCol, 0.7);

    float pixelY = gl_FragCoord.y;
    float scanline = 0.85 + 0.15 * sin(pixelY * 3.14159 * 2.0);
    col *= scanline;

    float scanBright = 0.95 + 0.05 * sin(pixelY * 0.5 - t * 10.0);
    col *= scanBright;

    vec2 pixelCoord = crtUV * iResolution;
    float subpixel = mod(pixelCoord.x, 3.0);
    vec3 phosphor;
    if (subpixel < 1.0) {
        phosphor = vec3(1.0, 0.3, 0.3);
    } else if (subpixel < 2.0) {
        phosphor = vec3(0.3, 1.0, 0.3);
    } else {
        phosphor = vec3(0.3, 0.3, 1.0);
    }
    col *= mix(vec3(1.0), phosphor, 0.3);

    float vig = 16.0 * crtUV.x * crtUV.y * (1.0 - crtUV.x) * (1.0 - crtUV.y);
    col *= pow(vig, 0.2);

    col *= 1.1;

    float flicker = 0.98 + 0.02 * sin(t * 60.0);
    col *= flicker;

    float grain = fract(sin(dot(gl_FragCoord.xy + t, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.03;

    col *= border;

    vec2 edgeDist = abs(crtUV - 0.5) * 2.0;
    float edgeGlow = smoothstep(0.95, 1.05, max(edgeDist.x, edgeDist.y));
    col += vec3(0.05, 0.05, 0.08) * edgeGlow;

    float bezel = smoothstep(1.0, 1.05, max(edgeDist.x * 1.02, edgeDist.y * 1.02));
    col = mix(col, vec3(0.02), bezel);

    fragColor = vec4(col, 1.0);
}
