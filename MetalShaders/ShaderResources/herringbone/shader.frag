#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float hbHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.2;
    float scale=6.0;
    vec2 p=uv*scale;
    float row=floor(p.y);
    float shift=mod(row,2.0)*0.5;
    vec2 bp=vec2(p.x+shift,p.y);
    float brickW=1.0,brickH=0.5;
    vec2 cell=floor(bp/vec2(brickW,brickH));
    vec2 f=fract(bp/vec2(brickW,brickH));
    float dir=mod(cell.x+cell.y,2.0);
    vec2 tf=dir>0.5?vec2(f.y,f.x):f;
    float h=hbHash(cell);
    vec3 baseCol=vec3(0.7+0.15*h,0.45+0.1*h,0.3+0.05*h);
    baseCol+=0.1*cos(t+cell.x*0.5+vec3(0,1,2));
    float mortar=0.04;
    float mx=smoothstep(0.0,mortar,tf.x)*smoothstep(1.0,1.0-mortar,tf.x);
    float my=smoothstep(0.0,mortar,tf.y)*smoothstep(1.0,1.0-mortar,tf.y);
    float m=mx*my;
    vec3 mortarCol=vec3(0.85,0.82,0.78);
    vec3 col=mix(mortarCol,baseCol,m);
    float vignette=1.0-0.3*length(uv-0.5);
    col*=vignette;
    fragColor=vec4(col,1.0);
}
