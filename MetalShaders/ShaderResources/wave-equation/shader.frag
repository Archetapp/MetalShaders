#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float weHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453);
}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float wave = 0.0;
    for(int i = 0; i < 6; i++){
        float fi = float(i);
        vec2 center = vec2(0.3 + 0.15*sin(t*0.7+fi*2.0), 0.3 + 0.15*cos(t*0.5+fi*1.5));
        float d = length(uv - center);
        float freq = 15.0 + fi*5.0;
        float speed = 2.0 + fi*0.5;
        wave += sin(d*freq - t*speed)/(1.0 + d*10.0) * 0.3;
    }
    vec2 wall = min(uv, 1.0-uv);
    float boundary = smoothstep(0.0, 0.05, wall.x)*smoothstep(0.0, 0.05, wall.y);
    wave *= boundary;
    float reflect = sin(uv.x*3.14159*2.0)*sin(uv.y*3.14159*2.0);
    wave += reflect*0.05*sin(t*3.0);
    vec3 col = vec3(0.0);
    col += vec3(0.1, 0.3, 0.8) * max(wave, 0.0);
    col += vec3(0.0, 0.1, 0.4) * max(-wave, 0.0);
    col += vec3(0.02, 0.05, 0.15);
    float crest = smoothstep(0.15, 0.2, wave);
    col += vec3(0.5, 0.7, 1.0)*crest*0.5;
    fragColor = vec4(col, 1.0);
}
