#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float wfHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float wfNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(wfHash(i),wfHash(i+vec2(1,0)),f.x),mix(wfHash(i+vec2(0,1)),wfHash(i+vec2(1,1)),f.x),f.y);
}
float wfFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*wfNoise(p);p*=2.0;a*=0.5;}return v;}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;
    vec3 col=vec3(0.15,0.25,0.12);
    float fallX=0.5;
    float fallW=0.3;
    float fallRegion=smoothstep(fallW,fallW-0.05,abs(uv.x-fallX));
    float cascade=wfFbm(vec2(uv.x*8.0,uv.y*4.0-t*3.0));
    float streaks=wfNoise(vec2(uv.x*20.0,uv.y*2.0-t*6.0));
    vec3 waterCol=mix(vec3(0.3,0.5,0.7),vec3(0.8,0.9,1.0),cascade*0.5+streaks*0.3);
    float foam=pow(wfNoise(vec2(uv.x*15.0,uv.y*3.0-t*5.0)),3.0);
    waterCol+=vec3(1.0)*foam*0.4;
    col=mix(col,waterCol,fallRegion);
    float baseY=0.15;
    float splash=smoothstep(baseY+0.1,baseY,uv.y)*fallRegion;
    float sprayNoise=wfNoise(vec2(uv.x*10.0+t,uv.y*20.0+t*2.0));
    float spread=smoothstep(0.0,0.3,abs(uv.x-fallX))*smoothstep(baseY+0.15,baseY,uv.y);
    vec3 sprayCol=vec3(0.7,0.8,0.9);
    col=mix(col,sprayCol,splash*sprayNoise*0.6);
    col=mix(col,vec3(0.9,0.95,1.0),spread*sprayNoise*0.3);
    float mist=wfFbm(vec2(uv.x*3.0+t*0.2,uv.y*5.0))*smoothstep(0.3,0.1,uv.y);
    col=mix(col,vec3(0.8,0.85,0.9),mist*0.2);
    fragColor=vec4(col,1.0);
}
