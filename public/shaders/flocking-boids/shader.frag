#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fbHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 fbBoidPos(float id, float t){
    float a = fbHash(vec2(id,0.0))*6.28;
    float r = 0.3+fbHash(vec2(id,1.0))*0.2;
    float s = 0.5+fbHash(vec2(id,2.0))*0.5;
    float flockX = sin(t*0.3)*0.2;
    float flockY = cos(t*0.2)*0.15;
    return vec2(flockX+cos(a+t*s)*r, flockY+sin(a+t*s*1.1)*r*0.6);
}

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    vec3 col = vec3(0.05, 0.07, 0.15);
    for(int i = 0; i < 50; i++){
        float fi = float(i);
        vec2 pos = fbBoidPos(fi, t);
        vec2 vel = fbBoidPos(fi, t+0.01) - pos;
        float angle = atan(vel.y, vel.x);
        vec2 dp = uv - pos;
        float cs = cos(-angle), sn = sin(-angle);
        vec2 rp = vec2(dp.x*cs - dp.y*sn, dp.x*sn + dp.y*cs);
        float body = length(rp*vec2(1.0,2.5));
        float wing = length((rp-vec2(-0.005,0.0))*vec2(2.0,1.0));
        float boid = min(body, wing);
        float g = 0.003/(boid+0.003);
        float hue = fract(fi*0.02+t*0.05);
        vec3 c = 0.5+0.5*cos(6.28*(hue+vec3(0.0,0.33,0.67)));
        col += c*g*0.08;
        for(int j = 1; j < 5; j++){
            vec2 tp = fbBoidPos(fi, t - float(j)*0.05);
            float td = length(uv - tp);
            col += c*0.0005/(td+0.005)*(1.0-float(j)/5.0);
        }
    }
    fragColor = vec4(col, 1.0);
}
