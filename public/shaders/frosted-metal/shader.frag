#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float fmNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 baseCol=vec3(0.6,0.62,0.65);
    float brush=fmNoise(vec2(uv.x*200.0,uv.y*5.0))*0.03;
    float brush2=fmNoise(vec2(uv.x*400.0,uv.y*3.0))*0.015;
    vec3 col=baseCol+brush+brush2;
    vec2 lp=vec2(0.5+0.3*sin(t*0.4),0.5+0.3*cos(t*0.3));
    float ld=length(uv-lp);
    float softSpec=exp(-ld*ld*4.0)*0.15;
    float brushSpec=fmNoise(vec2(uv.x*300.0+t*0.1,uv.y*4.0));
    brushSpec=pow(brushSpec,3.0)*exp(-ld*4.0)*0.2;
    col+=vec3(0.8,0.82,0.85)*softSpec;
    col+=vec3(0.9)*brushSpec;
    float frost=fmNoise(uv*30.0)*0.02;
    col+=frost;
    float vignette=1.0-length(uv-0.5)*0.5;
    col*=vignette;
    fragColor=vec4(col,1.0);}
