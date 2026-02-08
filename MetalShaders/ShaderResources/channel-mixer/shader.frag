#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene;scene.r=sin(uv.x*10.0+t)*0.5+0.5;
    scene.g=sin(uv.y*8.0-t*0.7)*0.5+0.5;
    scene.b=cos(length(uv-0.5)*15.0+t*0.5)*0.5+0.5;
    float mode=mod(t*0.2,3.0);
    vec3 mixed;
    if(mode<1.0){mixed.r=scene.g;mixed.g=scene.b;mixed.b=scene.r;}
    else if(mode<2.0){mixed.r=scene.b;mixed.g=scene.r;mixed.b=scene.g;}
    else{mixed.r=1.0-scene.r;mixed.g=scene.g;mixed.b=1.0-scene.b;}
    float blend=smoothstep(0.0,0.1,fract(mode));
    vec3 col=mix(scene,mixed,blend);
    float wave=sin(uv.x*50.0+t*2.0)*0.02;
    col.r=col.r+wave;col.b=col.b-wave;
    fragColor=vec4(clamp(col,0.0,1.0),1.0);}
