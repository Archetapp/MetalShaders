#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float ptHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene;
    scene.r=0.5+0.3*sin(uv.x*4.0+t*0.5);
    scene.g=0.4+0.3*sin(uv.y*3.0-t*0.3+1.0);
    scene.b=0.3+0.3*cos(length(uv-0.5)*6.0+t*0.4);
    float dotGrid=40.0;vec2 cell=floor(uv*dotGrid);
    vec2 f=fract(uv*dotGrid);
    float r=ptHash(cell);
    vec2 dotCenter=vec2(0.5+0.1*(r-0.5), 0.5+0.1*(ptHash(cell+vec2(1,0))-0.5));
    float d=length(f-dotCenter);
    float dotSize=0.3+0.1*ptHash(cell+vec2(2,0));
    float dot_val=smoothstep(dotSize,dotSize-0.1,d);
    vec3 dotColor=scene+vec3(ptHash(cell+vec2(3,0))-0.5,ptHash(cell+vec2(4,0))-0.5,ptHash(cell+vec2(5,0))-0.5)*0.15;
    dotColor=clamp(dotColor,0.0,1.0);
    vec3 canvas=vec3(0.92,0.88,0.82);
    vec3 col=mix(canvas,dotColor,dot_val);
    col+=vec3(ptHash(cell*17.0)-0.5)*0.03;
    fragColor=vec4(col,1.0);}
