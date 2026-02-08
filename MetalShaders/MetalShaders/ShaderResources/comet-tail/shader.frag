#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cometNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.005, 0.005, 0.02);

    vec2 cometPos = vec2(-0.1 + sin(iTime * 0.3) * 0.05, 0.05);
    vec2 toComet = uv - cometPos;
    float r = length(toComet);

    float nucleus = exp(-r * r * 800.0);
    col += vec3(1.0, 0.95, 0.8) * nucleus;

    float coma = exp(-r * 15.0);
    col += vec3(0.4, 0.6, 0.8) * coma * 0.5;

    float tailAngle = 0.3;
    vec2 tailDir = normalize(vec2(cos(tailAngle), sin(tailAngle)));
    float along = dot(toComet, tailDir);
    float perp = abs(dot(toComet, vec2(-tailDir.y, tailDir.x)));
    float tailWidth = 0.02 + along * 0.15;
    float dustTail = exp(-perp / tailWidth) * smoothstep(0.0, 0.05, along) * exp(-along * 2.0);

    float tailNoise = cometNoise(vec2(along * 20.0 - iTime * 2.0, perp * 30.0));
    dustTail *= 0.7 + 0.3 * tailNoise;
    col += vec3(0.8, 0.7, 0.4) * dustTail * 0.6;

    vec2 ionDir = normalize(vec2(cos(tailAngle - 0.15), sin(tailAngle - 0.15)));
    float ionAlong = dot(toComet, ionDir);
    float ionPerp = abs(dot(toComet, vec2(-ionDir.y, ionDir.x)));
    float ionWidth = 0.008 + ionAlong * 0.05;
    float ionTail = exp(-ionPerp / ionWidth) * smoothstep(0.0, 0.03, ionAlong) * exp(-ionAlong * 1.5);
    col += vec3(0.2, 0.4, 1.0) * ionTail * 0.4;

    for (int i = 0; i < 40; i++) {
        float fi = float(i);
        vec2 starPos = vec2(cometNoise(vec2(fi, 0.0)) - 0.5, cometNoise(vec2(0.0, fi)) - 0.5);
        float d = length(uv - starPos);
        col += exp(-d * d * 4000.0) * vec3(0.7, 0.75, 0.9) * 0.5;
    }

    fragColor = vec4(col, 1.0);
}
