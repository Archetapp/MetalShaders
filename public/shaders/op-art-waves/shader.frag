#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float freq = 25.0;

    float wave1 = sin(uv.y * freq + sin(uv.x * 3.0 + t) * 2.0);
    float wave2 = sin(uv.y * freq * 0.5 + sin(uv.x * 5.0 - t * 0.7) * 1.5 + 1.0);
    float wave3 = sin(uv.y * freq * 0.7 + sin(uv.x * 2.0 + t * 1.3) * 3.0 - 0.5);

    float distort = sin(length(uv) * 4.0 - t) * 0.5;
    float radial = sin(uv.y * freq + distort * freq * 0.3);

    float combined = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.2 + radial * 0.1;

    float stripe = smoothstep(-0.1, 0.1, combined);

    float bulge = sin(uv.x * 3.14159 * 2.0 + t * 0.5) * sin(uv.y * 3.14159 * 2.0 + t * 0.3);
    float widthMod = 1.0 + bulge * 0.3;
    float modStripe = smoothstep(-0.1 * widthMod, 0.1 * widthMod, combined);

    float depth = abs(combined) * 0.5;
    vec3 white = vec3(0.95 + depth * 0.05);
    vec3 black = vec3(0.02 + depth * 0.03);

    vec3 col = mix(black, white, modStripe);

    float edgeFade = smoothstep(0.05, 0.15, abs(fract(combined * 0.5 + 0.5) - 0.5));
    col = mix(col, col * 0.95, 1.0 - edgeFade);

    float vig = 1.0 - 0.4 * dot(uv, uv);
    col *= vig;

    fragColor = vec4(col, 1.0);
}
