#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float scale = 30.0;
    vec2 p = uv * scale;
    vec2 cell = floor(p);
    vec2 f = fract(p);
    float twill = mod(cell.x + cell.y, 2.0);
    float fiberDir = twill > 0.5 ? f.x : f.y;
    float fiber = sin(fiberDir * 12.566) * 0.5 + 0.5;
    fiber = pow(fiber, 0.5);
    float weaveDepth = twill * 0.15;
    vec3 darkFiber = vec3(0.02, 0.02, 0.03);
    vec3 lightFiber = vec3(0.08, 0.08, 0.1);
    vec3 col = mix(darkFiber, lightFiber, fiber);
    col += weaveDepth * 0.05;
    vec2 lightPos = vec2(0.5 + 0.3*sin(t*0.5), 0.5 + 0.3*cos(t*0.3));
    float lightDist = length(uv - lightPos);
    float specular = exp(-lightDist*lightDist*8.0);
    float microSpec = pow(fiber, 8.0) * specular;
    col += vec3(0.3, 0.3, 0.35) * specular * 0.4;
    col += vec3(0.5, 0.5, 0.6) * microSpec * 0.3;
    float resin = 0.02 + specular*0.08;
    col += vec3(resin);
    float crossGap = smoothstep(0.0, 0.05, f.x)*smoothstep(0.0, 0.05, f.y)*
                     smoothstep(1.0, 0.95, f.x)*smoothstep(1.0, 0.95, f.y);
    col *= 0.85 + crossGap*0.15;
    fragColor = vec4(col, 1.0);
}
