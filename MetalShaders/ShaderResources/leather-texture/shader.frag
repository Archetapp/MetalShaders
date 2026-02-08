#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float leatherHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float leatherNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(leatherHash(i), leatherHash(i+vec2(1,0)), f.x),
               mix(leatherHash(i+vec2(0,1)), leatherHash(i+vec2(1,1)), f.x), f.y);
}

float leatherVoronoi(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float md = 1.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 r = n + leatherHash(i + n + 0.5) * 0.8 - f;
        md = min(md, dot(r, r));
    }
    return sqrt(md);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.02;
    
    float largeBump = leatherVoronoi(uv * 8.0 + t);
    float medBump = leatherVoronoi(uv * 20.0 + t * 0.5);
    float pore = leatherNoise(uv * 100.0);
    
    float bump = largeBump * 0.5 + medBump * 0.3 + pore * 0.2;
    
    vec3 leather = vec3(0.35, 0.2, 0.1);
    vec3 highlight = vec3(0.5, 0.35, 0.2);
    vec3 shadow = vec3(0.15, 0.08, 0.04);
    
    vec3 col = mix(shadow, leather, smoothstep(0.1, 0.4, bump));
    col = mix(col, highlight, smoothstep(0.5, 0.8, bump));
    
    float specular = pow(max(0.0, bump - 0.5) * 2.0, 4.0) * 0.2;
    col += specular * vec3(0.8, 0.7, 0.5);
    
    float grain = leatherNoise(uv * 300.0) * 0.03;
    col += grain;
    
    fragColor = vec4(col, 1.0);
}
