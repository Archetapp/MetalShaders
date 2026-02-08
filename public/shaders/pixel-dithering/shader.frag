#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bayerMatrix(vec2 p) {
    vec2 i = mod(p, 4.0);
    int x = int(i.x);
    int y = int(i.y);
    int idx = x + y * 4;
    float bayer[16];
    bayer[0] = 0.0; bayer[1] = 8.0; bayer[2] = 2.0; bayer[3] = 10.0;
    bayer[4] = 12.0; bayer[5] = 4.0; bayer[6] = 14.0; bayer[7] = 6.0;
    bayer[8] = 3.0; bayer[9] = 11.0; bayer[10] = 1.0; bayer[11] = 9.0;
    bayer[12] = 15.0; bayer[13] = 7.0; bayer[14] = 13.0; bayer[15] = 5.0;
    for (int k = 0; k < 16; k++) {
        if (k == idx) return bayer[k] / 16.0;
    }
    return 0.0;
}

vec3 ditherQuantize(vec3 col, float levels) {
    return floor(col * levels + 0.5) / levels;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float pixelSize = 4.0;
    vec2 pixUV = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    vec2 pixCentered = (pixUV - 0.5 * iResolution.xy) / iResolution.y;

    vec3 scene = vec3(0.0);
    float r = length(pixCentered);
    float a = atan(pixCentered.y, pixCentered.x);
    scene.r = 0.5 + 0.5 * sin(r * 10.0 - iTime * 2.0 + a * 2.0);
    scene.g = 0.5 + 0.5 * sin(r * 8.0 - iTime * 1.5 + a * 3.0 + 2.0);
    scene.b = 0.5 + 0.5 * sin(r * 12.0 - iTime * 2.5 + a + 4.0);

    float gradient = smoothstep(0.5, 0.0, r);
    scene *= gradient;

    float dither = bayerMatrix(gl_FragCoord.xy / pixelSize);
    float levels = 4.0;
    vec3 col = ditherQuantize(scene + (dither - 0.5) / levels, levels);

    float scanline = mod(gl_FragCoord.y / pixelSize, 2.0) < 1.0 ? 0.95 : 1.0;
    col *= scanline;

    fragColor = vec4(col, 1.0);
}
