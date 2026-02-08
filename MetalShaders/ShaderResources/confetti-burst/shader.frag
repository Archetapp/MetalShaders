#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float cbHash(float p){return fract(sin(p*127.1)*43758.5453);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.95,0.95,0.97);
    float burstInterval=3.0;float burstTime=mod(t,burstInterval);
    for(int i=0;i<60;i++){
        float fi=float(i);
        float angle=cbHash(fi)*6.28;float speed=0.3+cbHash(fi+100.0)*0.4;
        float gravity=0.5;
        vec2 vel=vec2(cos(angle),sin(angle))*speed;
        vec2 pos=vel*burstTime+vec2(0,-gravity*burstTime*burstTime*0.5);
        float spin=burstTime*5.0+fi*2.0;
        float w=0.008+cbHash(fi+200.0)*0.006;
        float h=0.003+cbHash(fi+300.0)*0.004;
        float cs=cos(spin),sn=sin(spin);
        vec2 d=uv-pos;
        vec2 rd=vec2(d.x*cs-d.y*sn,d.x*sn+d.y*cs);
        float flutter=sin(burstTime*8.0+fi)*0.5;
        float rect=step(abs(rd.x),w*(1.0+flutter*0.3))*step(abs(rd.y),h);
        float fade=1.0-smoothstep(1.5,burstInterval,burstTime);
        float hue=cbHash(fi+400.0);
        vec3 confettiCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        confettiCol=max(confettiCol,vec3(0.3));
        col=mix(col,confettiCol,rect*fade);}
    fragColor=vec4(col,1.0);}
