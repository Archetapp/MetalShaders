#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 prismSpectrum(float t) {
    vec3 col = vec3(0.0);
    col += vec3(1.0, 0.0, 0.0) * smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.15, 0.3, t));
    col += vec3(1.0, 0.5, 0.0) * smoothstep(0.1, 0.25, t) * (1.0 - smoothstep(0.25, 0.4, t));
    col += vec3(1.0, 1.0, 0.0) * smoothstep(0.2, 0.35, t) * (1.0 - smoothstep(0.35, 0.5, t));
    col += vec3(0.0, 1.0, 0.0) * smoothstep(0.35, 0.45, t) * (1.0 - smoothstep(0.45, 0.6, t));
    col += vec3(0.0, 0.5, 1.0) * smoothstep(0.5, 0.6, t) * (1.0 - smoothstep(0.6, 0.75, t));
    col += vec3(0.3, 0.0, 1.0) * smoothstep(0.65, 0.75, t) * (1.0 - smoothstep(0.75, 0.9, t));
    col += vec3(0.5, 0.0, 0.8) * smoothstep(0.8, 0.9, t) * (1.0 - smoothstep(0.9, 1.0, t));
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 centered = uv - 0.5;
    
    float prismX = 0.35 + sin(iTime * 0.3) * 0.05;
    float beamY = 0.5 + sin(iTime * 0.5) * 0.05;
    
    float beam = smoothstep(0.008, 0.0, abs(centered.y)) * step(uv.x, prismX);
    beam *= smoothstep(0.0, 0.1, uv.x);
    
    float spread = (uv.x - prismX) * 1.2;
    float specY = centered.y / max(spread, 0.001);
    float specT = specY * 0.5 + 0.5;
    
    float rainbow = step(prismX, uv.x) * smoothstep(0.0, 0.05, spread);
    float bandWidth = 0.5 + spread * 2.0;
    rainbow *= smoothstep(bandWidth, bandWidth * 0.8, abs(specY));
    
    vec3 col = vec3(0.02);
    col += vec3(0.95, 0.95, 1.0) * beam * 2.0;
    col += prismSpectrum(clamp(specT, 0.0, 1.0)) * rainbow * 1.5;
    
    float prismShape = step(abs(centered.x - (prismX - 0.5)), 0.04) * step(abs(centered.y), 0.12);
    float prismEdge = smoothstep(0.04, 0.035, abs(centered.x - (prismX - 0.5))) * step(abs(centered.y), 0.12);
    col += vec3(0.15, 0.15, 0.2) * prismEdge * 0.5;
    
    fragColor = vec4(col, 1.0);
}
