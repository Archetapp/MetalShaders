#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float lavaBlob(vec2 uv, vec2 center, float radius) {
    return radius / (length(uv - center) + 0.01);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.6;
    
    float field = 0.0;
    field += lavaBlob(uv, vec2(sin(t*0.7)*0.15, sin(t*0.5)*0.3 + 0.1), 0.06);
    field += lavaBlob(uv, vec2(cos(t*0.6)*0.2, cos(t*0.4)*0.25 - 0.1), 0.05);
    field += lavaBlob(uv, vec2(sin(t*0.4+1.0)*0.1, sin(t*0.3+2.0)*0.35), 0.07);
    field += lavaBlob(uv, vec2(cos(t*0.8+2.0)*0.18, cos(t*0.6+1.0)*0.2+0.15), 0.04);
    field += lavaBlob(uv, vec2(sin(t*0.5+3.0)*0.12, sin(t*0.7+3.0)*0.3-0.2), 0.055);
    
    float blob = smoothstep(0.8, 1.5, field);
    
    vec3 lavaHot = vec3(1.0, 0.3, 0.05);
    vec3 lavaWarm = vec3(0.9, 0.1, 0.2);
    vec3 lavaCool = vec3(0.5, 0.05, 0.1);
    
    vec3 lava = mix(lavaCool, lavaWarm, smoothstep(0.8, 1.2, field));
    lava = mix(lava, lavaHot, smoothstep(1.2, 2.0, field));
    
    vec3 liquid = vec3(0.15, 0.02, 0.05);
    float lampShape = smoothstep(0.35, 0.3, abs(uv.x)) * smoothstep(0.5, 0.45, abs(uv.y));
    
    vec3 col = mix(liquid, lava, blob);
    col *= lampShape;
    col += (1.0 - lampShape) * vec3(0.02, 0.01, 0.02);
    
    fragColor = vec4(col, 1.0);
}
