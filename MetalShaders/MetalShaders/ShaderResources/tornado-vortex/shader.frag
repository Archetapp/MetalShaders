#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float tvNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float tvFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*tvNoise(p);p*=2.0;a*=0.5;}return v;}
float tvHash(float n){return fract(sin(n)*43758.5453);}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 sky=mix(vec3(0.15,0.15,0.12),vec3(0.25,0.22,0.2),uv.y+0.5);
    float stormCloud=tvFbm(vec2(uv.x*2.0+t*0.1,uv.y*1.5+0.5));
    sky=mix(sky,vec3(0.08,0.08,0.06),smoothstep(0.3,0.6,stormCloud)*smoothstep(0.0,0.3,uv.y+0.5));
    vec3 col=sky;
    float funnelTop=0.3;
    float funnelBot=-0.45;
    float yNorm=(uv.y-funnelBot)/(funnelTop-funnelBot);
    yNorm=clamp(yNorm,0.0,1.0);
    float funnelW=mix(0.02,0.15,yNorm*yNorm);
    float sway=sin(t*0.5)*0.03+sin(t*0.3+2.0)*0.02;
    float centerX=sway*yNorm;
    float dx=abs(uv.x-centerX);
    float funnelMask=smoothstep(funnelW,funnelW-0.02,dx);
    funnelMask*=step(funnelBot,uv.y)*step(uv.y,funnelTop);
    float a=atan(uv.y-funnelBot,uv.x-centerX);
    float spin=tvNoise(vec2(a*3.0+t*3.0,yNorm*5.0));
    vec3 funnelCol=mix(vec3(0.2,0.18,0.15),vec3(0.35,0.32,0.28),spin);
    funnelCol*=0.7+0.3*yNorm;
    col=mix(col,funnelCol,funnelMask*0.8);
    for(int i=0;i<20;i++){
        float fi=float(i);
        float h=tvHash(fi*7.3);
        float debrisY=funnelBot+mod(h*2.0+t*0.5,funnelTop-funnelBot);
        float norm=(debrisY-funnelBot)/(funnelTop-funnelBot);
        float radius=mix(0.01,0.12,norm*norm);
        float angle=h*6.28+t*3.0/(0.5+norm);
        vec2 dPos=vec2(centerX+cos(angle)*radius,debrisY);
        float dd=length(uv-dPos);
        float debris=smoothstep(0.005,0.0,dd);
        col=mix(col,vec3(0.15,0.12,0.1),debris*0.7);
    }
    float groundY=-0.45;
    float gnd=smoothstep(groundY+0.03,groundY,uv.y);
    col=mix(col,vec3(0.1,0.08,0.05),gnd);
    fragColor=vec4(col,1.0);
}
