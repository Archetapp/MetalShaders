#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float prNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.5;
    vec3 sky=mix(vec3(0.6,0.7,0.9),vec3(0.2,0.3,0.5),uv.y);
    float horizon=0.55;
    vec3 ground=vec3(0.25,0.2,0.15);
    float treeLine=step(horizon-0.05,uv.y)*step(uv.y,horizon+0.15);
    vec3 trees=vec3(0.1,0.2,0.05)*treeLine;
    vec3 scene=uv.y>horizon?mix(sky,trees,treeLine):ground;
    float puddleMask=smoothstep(0.4,0.35,length((uv-vec2(0.5,0.3))*vec2(1.5,2.5)));
    if(puddleMask>0.01){
        float reflY=horizon-(uv.y-0.0);
        float distort=prNoise(uv*10.0+t)*0.02+prNoise(uv*20.0+t*1.5)*0.01;
        vec2 reflUV=vec2(uv.x+distort,reflY+distort);
        vec3 reflScene=mix(vec3(0.6,0.7,0.9),vec3(0.2,0.3,0.5),reflUV.y);
        float reflTree=step(horizon-0.05,reflUV.y)*step(reflUV.y,horizon+0.15);
        reflScene=mix(reflScene,vec3(0.1,0.2,0.05),reflTree);
        reflScene*=0.7;
        float ripple=sin(length(uv-vec2(0.5,0.3))*60.0-t*3.0)*0.02;
        reflScene+=ripple;
        scene=mix(scene,reflScene,puddleMask*0.85);
        float edgeGlint=pow(1.0-puddleMask,10.0)*puddleMask*5.0;
        scene+=vec3(0.3,0.35,0.4)*edgeGlint;
    }
    fragColor=vec4(scene,1.0);
}
