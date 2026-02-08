#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.3;
    vec2 c1=vec2(0.15*cos(t),0.15*sin(t));
    vec2 c2=vec2(-0.15*cos(t*0.7),-0.15*sin(t*0.7));
    float freq=60.0;
    float r1=length(uv-c1);
    float r2=length(uv-c2);
    float p1=sin(r1*freq);
    float p2=sin(r2*freq);
    float moire=p1*p2;
    vec3 col1=vec3(0.1,0.4,0.8);
    vec3 col2=vec3(0.8,0.2,0.4);
    vec3 col=mix(col1,col2,moire*0.5+0.5);
    col+=0.15*sin(moire*3.14159+t+vec3(0,2,4));
    float v=0.8+0.2*moire;
    col*=v;
    fragColor=vec4(col,1.0);
}
