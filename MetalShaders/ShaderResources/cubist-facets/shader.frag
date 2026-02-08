#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float cfHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float scale=5.0+sin(t*0.2);vec2 cell=floor(uv*scale);
    float id=cfHash(cell);
    float angle=id*6.28+t*0.1;
    vec2 f=fract(uv*scale)-0.5;
    float cs=cos(angle),sn=sin(angle);
    vec2 rf=vec2(f.x*cs-f.y*sn,f.x*sn+f.y*cs);
    vec2 shifted=uv+rf*0.1;
    float d=length(shifted);
    float circleScene=smoothstep(0.3,0.28,d);
    float rectScene=step(abs(shifted.x),0.2)*step(abs(shifted.y),0.15);
    float hue=id+t*0.05;
    vec3 baseCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    vec3 col=baseCol*(0.4+0.3*circleScene+0.3*rectScene);
    float shade=rf.x*0.5+0.5;
    col*=0.7+0.3*shade;
    float edge=smoothstep(0.0,0.05,f.x+0.5)*smoothstep(0.0,0.05,f.y+0.5)*
               smoothstep(1.0,0.95,f.x+0.5)*smoothstep(1.0,0.95,f.y+0.5);
    float edgeLine=1.0-edge;
    col=mix(col,vec3(0.1),edgeLine*0.8);
    fragColor=vec4(col,1.0);}
