#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float csHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
float csNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(csHash(i),csHash(i+vec2(1,0)),f.x),mix(csHash(i+vec2(0,1)),csHash(i+vec2(1,1)),f.x),f.y);
}
float csFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<6;i++){v+=a*csNoise(p);p*=2.0;a*=0.5;}return v;}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.08;
    vec3 groundLit=vec3(0.45,0.6,0.25);
    vec3 groundShade=vec3(0.2,0.35,0.12);
    float grassDetail=csNoise(uv*50.0)*0.05;
    vec3 ground=groundLit+grassDetail;
    float perspective=1.0/(0.5+uv.y*1.5);
    vec2 cloudUV=vec2(uv.x*perspective+t,uv.y*perspective+t*0.3);
    float clouds=csFbm(cloudUV*2.0);
    float shadowMask=smoothstep(0.35,0.55,clouds);
    float softness=0.1+uv.y*0.2;
    shadowMask=smoothstep(0.5-softness,0.5+softness,clouds);
    ground=mix(ground,groundShade,shadowMask*0.6);
    float lightShaft=1.0-shadowMask;
    ground+=vec3(0.1,0.08,0.02)*lightShaft*0.3;
    vec3 col=ground;
    float horizon=smoothstep(0.95,1.0,uv.y);
    vec3 sky=mix(vec3(0.5,0.65,0.9),vec3(0.35,0.5,0.8),uv.y);
    float skyClouds=csFbm(vec2(uv.x*3.0+t,uv.y*2.0));
    sky=mix(sky,vec3(0.9,0.92,0.95),smoothstep(0.4,0.7,skyClouds)*0.5);
    col=mix(col,sky,horizon);
    float pathX=0.5+sin(uv.y*3.0)*0.05;
    float path=smoothstep(0.03,0.02,abs(uv.x-pathX))*(1.0-horizon);
    col=mix(col,vec3(0.55,0.5,0.4),path*0.4);
    fragColor=vec4(col,1.0);
}
