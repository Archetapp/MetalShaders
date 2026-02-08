#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float exNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float exFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*exNoise(p);p*=2.0;a*=0.5;}return v;}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=mod(iTime,4.0);
    vec3 col=vec3(0.02);
    float r=length(uv);
    float a=atan(uv.y,uv.x);
    float expand=t*0.3;
    float fireball=smoothstep(expand+0.05,expand-0.05,r);
    float n=exFbm(vec2(a*3.0,r*5.0-t*2.0));
    fireball*=0.5+0.5*n;
    fireball*=smoothstep(4.0,1.0,t);
    vec3 fireCol=mix(vec3(1.0,0.9,0.3),vec3(1.0,0.3,0.0),r/max(expand,0.01));
    fireCol=mix(fireCol,vec3(0.3,0.1,0.0),smoothstep(0.5,1.0,t*0.3));
    col+=fireCol*fireball*2.0;
    float shockR=t*0.5;
    float shockW=0.02+t*0.01;
    float shock=smoothstep(shockW,0.0,abs(r-shockR))*smoothstep(3.0,0.5,t);
    col+=vec3(1.0,0.8,0.5)*shock*0.8;
    float smoke=exFbm(vec2(a*2.0+t*0.3,r*3.0-t*0.5));
    float smokeMask=smoothstep(expand*1.5,expand*0.5,r)*smoothstep(1.0,2.0,t);
    col=mix(col,vec3(0.15,0.12,0.1),smokeMask*smoke*0.6);
    float flash=exp(-t*3.0)*0.5;
    col+=vec3(1.0,0.9,0.7)*flash;
    fragColor=vec4(col,1.0);
}
