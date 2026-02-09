#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 newtonCmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 newtonCdiv(vec2 a, vec2 b) { float d = dot(b,b) + 1e-10; return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/d; }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float zoom = 2.0 + sin(iTime * 0.2) * 0.5;
    vec2 z = uv * zoom;
    
    vec2 root1 = vec2(1.0, 0.0);
    vec2 root2 = vec2(-0.5, 0.866);
    vec2 root3 = vec2(-0.5, -0.866);
    
    float iter = 0.0;
    for (float i = 0.0; i < 50.0; i++) {
        vec2 z2 = newtonCmul(z, z);
        vec2 z3 = newtonCmul(z2, z);
        vec2 f = z3 - vec2(1.0, 0.0);
        vec2 fp = 3.0 * z2;
        z -= newtonCdiv(f, fp);
        iter = i;
        if (dot(f, f) < 0.0001) break;
    }
    
    float d1 = length(z - root1);
    float d2 = length(z - root2);
    float d3 = length(z - root3);
    
    float shade = exp(-iter * 0.1);
    
    vec3 col;
    if (d1 < d2 && d1 < d3) col = vec3(0.9, 0.2, 0.3) * shade;
    else if (d2 < d3) col = vec3(0.2, 0.8, 0.3) * shade;
    else col = vec3(0.2, 0.3, 0.9) * shade;
    
    col += 0.1 * shade;
    
    fragColor = vec4(col, 1.0);
}
