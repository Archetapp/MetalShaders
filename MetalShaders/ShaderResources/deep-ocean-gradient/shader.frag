#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float oceanCaustic(vec2 uv, float t) {
    float c = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 p = uv * (2.0 + fi) + t * (0.3 + fi * 0.1);
        c += sin(p.x * 3.14159 + sin(p.y * 2.5 + t)) * 0.33;
    }
    return pow(abs(c), 2.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.5;
    float depth = 1.0 - uv.y;
    
    vec3 shallow = vec3(0.0, 0.8, 0.7);
    vec3 mid = vec3(0.0, 0.3, 0.6);
    vec3 deep = vec3(0.0, 0.05, 0.15);
    
    vec3 col = depth < 0.5 ? mix(shallow, mid, depth * 2.0) : mix(mid, deep, (depth - 0.5) * 2.0);
    
    float caustic = oceanCaustic(uv * 3.0, t);
    float causticFade = (1.0 - depth) * (1.0 - depth);
    col += caustic * causticFade * vec3(0.2, 0.6, 0.5) * 0.5;
    
    float particles = sin(uv.x * 50.0 + t * 3.0) * sin(uv.y * 50.0 + t * 2.0);
    particles = smoothstep(0.95, 1.0, particles);
    col += particles * (1.0 - depth) * vec3(0.3, 0.6, 0.5) * 0.3;
    
    float rays = max(0.0, sin(uv.x * 5.0 + sin(uv.y * 2.0 + t) * 0.5));
    rays = pow(rays, 4.0) * (1.0 - depth) * 0.15;
    col += rays * vec3(0.3, 0.7, 0.6);
    
    fragColor = vec4(col, 1.0);
}
