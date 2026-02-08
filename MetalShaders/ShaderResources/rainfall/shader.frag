#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rfHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;
    vec3 sky=mix(vec3(0.2,0.22,0.25),vec3(0.35,0.38,0.42),uv.y);
    vec3 col=sky;
    float groundY=0.15;
    float ground=smoothstep(groundY+0.02,groundY,uv.y);
    col=mix(col,vec3(0.12,0.13,0.11),ground);
    float rain=0.0;
    for(int layer=0;layer<3;layer++){
        float fl=float(layer);
        float scale=20.0+fl*10.0;
        float speed=1.5+fl*0.5;
        float thickness=0.01-fl*0.002;
        for(int i=0;i<20;i++){
            float fi=float(i);
            float x=rfHash(vec2(fi+fl*100.0,0.0));
            float phase=fract(t*speed*0.3+rfHash(vec2(fi,fl)));
            float y=1.0-phase;
            float streakLen=0.04+fl*0.01;
            float dx=abs(uv.x-x);
            if(dx<thickness){
                float inStreak=step(y-streakLen,uv.y)*step(uv.y,y);
                float fade=smoothstep(0.0,streakLen,(uv.y-(y-streakLen)));
                rain+=inStreak*fade*(1.0-fl*0.25);
            }
            if(y<groundY+0.03){
                float splashPhase=1.0-phase;
                if(splashPhase<0.1){
                    float splashR=splashPhase*0.3;
                    float splashD=length(vec2(uv.x-x,(uv.y-groundY)*3.0));
                    float splash=smoothstep(splashR+0.005,splashR,splashD)*(1.0-splashPhase*10.0);
                    rain+=splash*0.5;
                }
            }
        }
    }
    col+=vec3(0.5,0.55,0.6)*rain*0.4;
    col*=0.9+0.1*sin(uv.y*200.0+t*20.0)*0.05;
    fragColor=vec4(col,1.0);
}
