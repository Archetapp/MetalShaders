#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float stBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float stChar(vec2 p,int c){
    float d=1e5;
    if(c==0){d=min(d,abs(length(p-vec2(0,0.1))-0.2)-0.04);
        d=min(d,stBox(p-vec2(-0.18,-0.15),vec2(0.04,0.15)));
        d=min(d,stBox(p-vec2(0.18,-0.15),vec2(0.04,0.15)));}
    else if(c==1){d=min(d,stBox(p,vec2(0.04,0.3)));
        d=min(d,stBox(p-vec2(0,0.3),vec2(0.15,0.04)));
        d=min(d,stBox(p-vec2(0,-0.3),vec2(0.15,0.04)));}
    else if(c==2){d=min(d,stBox(p-vec2(-0.15,0),vec2(0.04,0.3)));
        d=min(d,stBox(p-vec2(0.15,0),vec2(0.04,0.3)));
        d=min(d,stBox(p-vec2(0,0.0),vec2(0.15,0.04)));}
    return d;}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.05,0.05,0.1);
    float totalD=1e5;
    for(int i=0;i<3;i++){float fi=float(i);
        vec2 offset=vec2(-0.4+fi*0.4,0.05*sin(t*2.0+fi));
        float charD=stChar(uv-offset,i);
        totalD=min(totalD,charD);}
    float glow=0.01/(totalD+0.01);
    float hue=fract(t*0.1);
    vec3 glowCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    col+=glowCol*glow*0.5;
    float fill=smoothstep(0.01,0.0,totalD);
    col+=vec3(0.9)*fill;
    float outline=smoothstep(0.06,0.04,totalD)-smoothstep(0.04,0.02,totalD);
    col+=glowCol*outline*0.8;
    fragColor=vec4(col,1.0);}
