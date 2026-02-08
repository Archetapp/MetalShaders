#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ngNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    float r=length(uv);
    float a=atan(uv.y,uv.x);
    vec3 col=vec3(0.0,0.0,0.02);
    float coreR=0.08;
    float core=smoothstep(coreR,coreR*0.3,r);
    vec3 cherenkov=vec3(0.1,0.4,1.0);
    col+=cherenkov*core*2.0;
    col+=vec3(0.8,0.9,1.0)*smoothstep(coreR*0.3,0.0,r)*1.5;
    float innerGlow=exp(-r*8.0);
    col+=cherenkov*innerGlow*0.8;
    for(int i=0;i<6;i++){
        float fi=float(i);
        float ringR=0.15+fi*0.08;
        float phase=fract(t*0.3+fi*0.167);
        float expandR=ringR+phase*0.3;
        float ringAlpha=(1.0-phase);
        ringAlpha*=ringAlpha;
        float ring=smoothstep(0.015,0.0,abs(r-expandR))*ringAlpha;
        float n=ngNoise(vec2(a*5.0+fi,t*2.0))*0.3;
        ring*=(0.7+n);
        col+=cherenkov*ring*0.6;
    }
    float rays=0.0;
    for(int i=0;i<8;i++){
        float ra=float(i)*0.785+t*0.1;
        float d=abs(sin(a-ra));
        rays+=exp(-d*30.0)*exp(-r*4.0)*0.15;
    }
    col+=cherenkov*rays;
    float flicker=0.9+0.1*sin(t*20.0)*sin(t*13.0);
    col*=flicker;
    fragColor=vec4(col,1.0);
}
