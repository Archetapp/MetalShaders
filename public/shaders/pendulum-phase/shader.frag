#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    vec3 col = vec3(0.02, 0.02, 0.05);
    float th1 = 1.5*sin(t*1.1) + 0.8*sin(t*2.7);
    float th2 = 2.0*sin(t*1.7) + 1.0*sin(t*3.1);
    float l1 = 0.15, l2 = 0.12;
    vec2 p1 = vec2(sin(th1), -cos(th1))*l1;
    vec2 p2 = p1 + vec2(sin(th2), -cos(th2))*l2;
    float pivot = smoothstep(0.008, 0.004, length(uv));
    col += vec3(0.5)*pivot;
    float rod1 = smoothstep(0.004, 0.002, abs(length(uv)/l1 - 0.5) - 0.0);
    float ang1 = atan(uv.y, uv.x) - atan(p1.y, p1.x);
    float joint1 = smoothstep(0.008, 0.004, length(uv-p1));
    col += vec3(0.3, 0.5, 0.8)*joint1;
    float joint2 = smoothstep(0.008, 0.004, length(uv-p2));
    col += vec3(0.8, 0.3, 0.3)*joint2;
    float lineW = 0.002;
    for(float s = 0.0; s < 1.0; s += 0.02){
        vec2 lp = mix(vec2(0.0), p1, s);
        float d = length(uv-lp);
        col += vec3(0.2, 0.3, 0.5)*smoothstep(lineW, 0.0, d)*0.5;
    }
    for(float s = 0.0; s < 1.0; s += 0.02){
        vec2 lp = mix(p1, p2, s);
        float d = length(uv-lp);
        col += vec3(0.5, 0.2, 0.3)*smoothstep(lineW, 0.0, d)*0.5;
    }
    for(int i = 0; i < 80; i++){
        float ti = t - float(i)*0.02;
        float a1 = 1.5*sin(ti*1.1)+0.8*sin(ti*2.7);
        float a2 = 2.0*sin(ti*1.7)+1.0*sin(ti*3.1);
        vec2 tp = vec2(sin(a1),- cos(a1))*l1 + vec2(sin(a2),-cos(a2))*l2;
        float d = length(uv - tp);
        float alpha = 1.0 - float(i)/80.0;
        float hue = float(i)/80.0;
        vec3 tc = 0.5+0.5*cos(6.28*(hue+vec3(0.0,0.33,0.67)));
        col += tc*0.003/(d+0.003)*alpha;
    }
    fragColor = vec4(col, 1.0);
}
