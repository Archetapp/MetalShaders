#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 simplexPerm(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplexNoise2D(vec2 v) {
    vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = simplexPerm(simplexPerm(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g) * 0.5 + 0.5;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.15;
    
    float n = 0.0;
    float amp = 0.5;
    vec2 p = uv * 4.0;
    for (int i = 0; i < 6; i++) {
        n += amp * simplexNoise2D(p + t);
        p *= 2.0;
        amp *= 0.5;
        t *= 1.2;
    }
    
    vec3 c1 = vec3(0.05, 0.1, 0.2);
    vec3 c2 = vec3(0.2, 0.5, 0.6);
    vec3 c3 = vec3(0.8, 0.9, 0.7);
    
    vec3 col = n < 0.4 ? mix(c1, c2, n * 2.5) : mix(c2, c3, (n - 0.4) * 1.67);
    
    fragColor = vec4(col, 1.0);
}
