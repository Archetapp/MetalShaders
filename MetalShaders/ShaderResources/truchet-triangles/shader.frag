#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ttHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float scale=10.0;
    vec2 cell=floor(uv*scale);
    vec2 f=fract(uv*scale);
    float h=ttHash(cell);
    float flip=step(0.5,fract(h+iTime*0.3));
    if(flip>0.5) f=vec2(1.0-f.x,f.y);
    float d1=f.x+f.y-1.0;
    float d2=f.x-f.y;
    float t=iTime*0.5;
    vec3 c1=0.5+0.5*cos(t+vec3(0,2,4)+cell.x*0.5);
    vec3 c2=0.5+0.5*cos(t+vec3(1,3,5)+cell.y*0.5);
    vec3 col=mix(c1,c2,step(0.0,d1));
    float edge=min(abs(d1),abs(d2));
    edge=min(edge,min(min(f.x,f.y),min(1.0-f.x,1.0-f.y)));
    float line=1.0-smoothstep(0.0,0.03,edge);
    col=mix(col,vec3(1),line*0.7);
    fragColor=vec4(col,1.0);
}
