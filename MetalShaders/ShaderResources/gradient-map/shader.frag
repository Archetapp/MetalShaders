#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 gmRamp(float v,float t){
    vec3 c0=vec3(0.05,0.0,0.2);vec3 c1=vec3(0.8,0.1,0.3);
    vec3 c2=vec3(1.0,0.6,0.1);vec3 c3=vec3(1.0,0.95,0.8);
    float shift=sin(t*0.3)*0.1;v=clamp(v+shift,0.0,1.0);
    if(v<0.33)return mix(c0,c1,v*3.0);
    if(v<0.66)return mix(c1,c2,(v-0.33)*3.0);
    return mix(c2,c3,(v-0.66)*3.0);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float luma=0.0;
    luma+=sin(uv.x*10.0+t)*sin(uv.y*8.0-t*0.7)*0.3;
    luma+=smoothstep(0.3,0.0,length(uv-vec2(0.5+0.2*sin(t*0.5),0.5+0.2*cos(t*0.3))))*0.4;
    luma+=0.3;
    vec3 col=gmRamp(luma,t);
    fragColor=vec4(col,1.0);}
