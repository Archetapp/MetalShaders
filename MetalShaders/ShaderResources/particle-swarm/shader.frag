#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float psHash(vec2 p){return fract(sin(dot(p,vec2(41.1,289.7)))*43758.5453);}

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float brightness = 0.0;
    vec3 col = vec3(0.0);
    for(int i = 0; i < 40; i++){
        float fi = float(i);
        float phase = fi * 0.157 + psHash(vec2(fi, 0.0))*6.28;
        float r = 0.2 + 0.15*sin(t*0.3+fi*0.5);
        vec2 attractor = vec2(cos(t*0.2+fi*0.8), sin(t*0.3+fi*0.6))*0.25;
        vec2 pos = attractor + vec2(cos(t*1.5+phase), sin(t*1.5+phase*1.3))*r;
        float d = length(uv - pos);
        float glow = 0.002 / (d*d + 0.001);
        float hue = fract(fi*0.05 + t*0.1);
        vec3 c = 0.5+0.5*cos(6.28*(hue+vec3(0.0,0.33,0.67)));
        col += c * glow * 0.15;
        for(int j = 1; j < 8; j++){
            float tj = t - float(j)*0.03;
            vec2 trailPos = attractor + vec2(cos(tj*1.5+phase), sin(tj*1.5+phase*1.3))*r;
            float td = length(uv - trailPos);
            col += c * 0.001/(td*td+0.001) * (1.0 - float(j)/8.0) * 0.1;
        }
    }
    col = 1.0 - exp(-col*2.0);
    fragColor = vec4(col, 1.0);
}
