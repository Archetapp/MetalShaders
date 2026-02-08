#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float weaveHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float weaveNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(weaveHash(i), weaveHash(i+vec2(1,0)), f.x),
               mix(weaveHash(i+vec2(0,1)), weaveHash(i+vec2(1,1)), f.x), f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.1;
    
    float scale = 20.0;
    vec2 grid = uv * scale;
    vec2 cell = floor(grid);
    vec2 local = fract(grid);
    
    float checkerboard = mod(cell.x + cell.y, 2.0);
    
    float warpThread = smoothstep(0.0, 0.15, local.y) * smoothstep(1.0, 0.85, local.y);
    float weftThread = smoothstep(0.0, 0.15, local.x) * smoothstep(1.0, 0.85, local.x);
    
    float threadNoise = weaveNoise(cell * 0.5 + t) * 0.15;
    
    float thread;
    if (checkerboard > 0.5) {
        thread = warpThread * (0.7 + weftThread * 0.3);
    } else {
        thread = weftThread * (0.7 + warpThread * 0.3);
    }
    
    vec3 warpColor = vec3(0.3, 0.15, 0.5) + threadNoise;
    vec3 weftColor = vec3(0.5, 0.35, 0.2) + threadNoise;
    
    vec3 col = mix(warpColor, weftColor, checkerboard) * thread;
    
    float shadow = 1.0 - (1.0 - thread) * 0.3;
    col *= shadow;
    
    float fuzz = weaveNoise(uv * 200.0) * 0.04;
    col += fuzz;
    
    fragColor = vec4(col, 1.0);
}
