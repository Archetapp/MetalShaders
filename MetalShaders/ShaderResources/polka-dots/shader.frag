#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float pdHash(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5);}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;
    float scale=10.0;
    vec2 p=uv*scale;
    vec2 cell=floor(p);
    vec2 f=fract(p)-0.5;
    float h=pdHash(cell);
    float phase=h*6.2832+t*2.0;
    float radius=0.25+0.1*sin(phase);
    float d=length(f);
    float dot_shape=smoothstep(radius+0.02,radius-0.02,d);
    vec3 dotCol=0.5+0.5*cos(h*6.28+t*0.5+vec3(0,2,4));
    vec3 bgCol=vec3(0.95,0.93,0.9);
    vec3 col=mix(bgCol,dotCol,dot_shape);
    float shadow=smoothstep(radius+0.08,radius,d)*0.15;
    col-=shadow;
    fragColor=vec4(col,1.0);
}
