#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float gnHash(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime * 0.5;
    vec3 col = vec3(0.01, 0.01, 0.03);
    float stars = step(0.998, gnHash(floor(gl_FragCoord.xy*0.3)));
    col += stars * 0.3;
    vec3 bodyColors[5];
    bodyColors[0] = vec3(1.0, 0.4, 0.1);
    bodyColors[1] = vec3(0.2, 0.5, 1.0);
    bodyColors[2] = vec3(0.1, 0.9, 0.4);
    bodyColors[3] = vec3(0.9, 0.2, 0.8);
    bodyColors[4] = vec3(1.0, 0.9, 0.2);
    float sizes[5];
    sizes[0] = 0.025; sizes[1] = 0.018; sizes[2] = 0.015;
    sizes[3] = 0.012; sizes[4] = 0.02;
    for(int i = 0; i < 5; i++){
        float fi = float(i);
        float orbitR = 0.15 + fi*0.06;
        float speed = 1.0/(0.5+fi*0.3);
        float phase = fi*1.256;
        float ecc = 0.1+fi*0.05;
        vec2 pos = vec2(cos(t*speed+phase)*(orbitR+ecc*sin(t*speed*2.0)),
                       sin(t*speed+phase)*orbitR*0.8);
        float d = length(uv - pos);
        float body = smoothstep(sizes[i], sizes[i]-0.005, d);
        col += bodyColors[i]*body;
        float glow = sizes[i]*0.02/(d*d+0.001);
        col += bodyColors[i]*glow*0.3;
        for(int j = 0; j < 30; j++){
            float tj = t - float(j)*0.02;
            vec2 tp = vec2(cos(tj*speed+phase)*(orbitR+ecc*sin(tj*speed*2.0)),
                          sin(tj*speed+phase)*orbitR*0.8);
            float td = length(uv - tp);
            float trail = 0.001/(td+0.003)*(1.0-float(j)/30.0);
            col += bodyColors[i]*trail*0.03;
        }
    }
    fragColor = vec4(col, 1.0);
}
