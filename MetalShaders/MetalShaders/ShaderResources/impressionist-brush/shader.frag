#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float ibHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ibNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(ibHash(i),ibHash(i+vec2(1,0)),f.x),mix(ibHash(i+vec2(0,1)),ibHash(i+vec2(1,1)),f.x),f.y);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene;scene.r=0.5+0.3*sin(uv.x*3.0+t*0.3);
    scene.g=0.5+0.3*sin(uv.y*4.0-t*0.2+1.0);
    scene.b=0.4+0.3*cos(length(uv-0.5)*5.0+t*0.4);
    float brushScale=30.0;vec2 cell=floor(uv*brushScale);
    float angle=ibHash(cell)*3.14159-1.57+0.3*sin(t*0.2+ibHash(cell+vec2(1,0))*6.0);
    float cs=cos(angle),sn=sin(angle);
    vec2 f=fract(uv*brushScale)-0.5;
    vec2 rf=vec2(f.x*cs-f.y*sn,f.x*sn+f.y*cs);
    float brushStroke=smoothstep(0.4,0.0,abs(rf.y)*3.0)*smoothstep(0.5,0.3,abs(rf.x));
    float thick=0.7+ibHash(cell+vec2(2,0))*0.6;
    brushStroke*=thick;
    vec3 brushCol=scene+vec3(ibHash(cell+vec2(3,0))-0.5,ibHash(cell+vec2(4,0))-0.5,ibHash(cell+vec2(5,0))-0.5)*0.2;
    brushCol=clamp(brushCol,0.0,1.0);
    vec3 canvas=vec3(0.9,0.87,0.8);
    vec3 col=mix(canvas,brushCol,brushStroke);
    col+=vec3(ibHash(cell*17.0)-0.5)*0.04;
    fragColor=vec4(col,1.0);}
