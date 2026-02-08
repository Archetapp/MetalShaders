#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 lightPos = vec2(sin(iTime*0.4)*0.3, cos(iTime*0.3)*0.2 + 0.15);
    vec2 toLight = uv - lightPos;
    float dist = length(toLight);

    vec3 col = vec3(0.01, 0.01, 0.02);

    float mainGlow = 0.02 / (dist + 0.02);
    col += mainGlow * vec3(1.0, 0.9, 0.7) * 0.3;
    float core = exp(-dist * dist * 500.0);
    col += core * vec3(1.0, 0.95, 0.9);

    float anamorphicH = exp(-toLight.y * toLight.y * 100.0) * exp(-abs(toLight.x) * 3.0);
    col += anamorphicH * vec3(0.3, 0.5, 0.8) * 0.3;

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ghostScale = 0.3 + fi * 0.25;
        vec2 ghostPos = -lightPos * ghostScale;
        float ghostDist = length(uv - ghostPos);
        float ghostSize = 0.02 + fi * 0.015;
        float ghost = exp(-pow(ghostDist - ghostSize, 2.0) * 1000.0);
        ghost += exp(-ghostDist * ghostDist * 200.0) * 0.3;
        vec3 ghostColor = 0.5 + 0.5 * cos(6.28 * (fi * 0.15 + vec3(0.0, 0.33, 0.67)));
        col += ghost * ghostColor * 0.15;
    }

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float angle = fi * 0.785 + 0.2;
        vec2 streakDir = vec2(cos(angle), sin(angle));
        float streak = pow(max(abs(dot(toLight, streakDir)), 0.0), 1.0);
        streak = exp(-streak * 50.0) * exp(-dist * 5.0);
        col += streak * vec3(0.8, 0.85, 1.0) * 0.05;
    }

    float iris = exp(-pow(dist - 0.08, 2.0) * 2000.0) * 0.2;
    col += iris * vec3(0.5, 0.3, 0.8);

    float chromatic = exp(-dist * 8.0) * 0.1;
    col.r += chromatic * 0.3;
    col.b += chromatic * 0.2;

    fragColor = vec4(col, 1.0);
}
