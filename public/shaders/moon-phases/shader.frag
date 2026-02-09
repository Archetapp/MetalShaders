#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float mpHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float mpNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(mpHash(i),mpHash(i+vec2(1,0)),f.x),mix(mpHash(i+vec2(0,1)),mpHash(i+vec2(1,1)),f.x),f.y);
}

float mpCrater(vec2 p,vec2 center,float r){
    float d=length(p-center);
    float rim=smoothstep(r,r-r*0.1,d)-smoothstep(r-r*0.1,r-r*0.3,d);
    float bowl=smoothstep(r-r*0.2,0.0,d);
    return rim*0.3-bowl*0.15;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.1;
    vec3 col=vec3(0.0,0.0,0.02);
    for(float i=0.0;i<200.0;i++){
        vec2 starPos=vec2(mpHash(vec2(i,0.0))-0.5,mpHash(vec2(0.0,i))-0.5)*2.0;
        float brightness=mpHash(vec2(i,i))*0.5;
        float twinkle=0.7+0.3*sin(t*5.0+i*3.0);
        float sd=length(uv-starPos);
        col+=vec3(brightness*twinkle)*smoothstep(0.003,0.0,sd);
    }
    float moonR=0.25;
    float moonDist=length(uv);
    float moonMask=smoothstep(moonR,moonR-0.003,moonDist);
    if(moonMask>0.01){
        float normDist=moonDist/moonR;
        vec3 normal=normalize(vec3(uv/moonR,sqrt(max(0.0,1.0-normDist*normDist))));
        float phase=mod(t*0.5,6.2832);
        vec3 sunDir=normalize(vec3(cos(phase),0.0,sin(phase)));
        float diff=max(dot(normal,sunDir),0.0);
        vec3 moonBase=vec3(0.6,0.58,0.55);
        float n=mpNoise(uv*20.0)*0.1+mpNoise(uv*40.0)*0.05;
        moonBase+=n;
        float craters=0.0;
        craters+=mpCrater(uv,vec2(0.08,0.05),0.04);
        craters+=mpCrater(uv,vec2(-0.1,0.1),0.06);
        craters+=mpCrater(uv,vec2(0.05,-0.12),0.035);
        craters+=mpCrater(uv,vec2(-0.07,-0.05),0.05);
        craters+=mpCrater(uv,vec2(0.15,0.0),0.03);
        craters+=mpCrater(uv,vec2(-0.02,0.15),0.025);
        craters+=mpCrater(uv,vec2(0.12,-0.08),0.02);
        craters+=mpCrater(uv,vec2(-0.15,0.05),0.04);
        moonBase+=craters;
        float maria=smoothstep(0.4,0.6,mpNoise(uv*5.0+3.0));
        moonBase=mix(moonBase,moonBase*0.7,maria*0.3);
        vec3 moonCol=moonBase*diff;
        float earthshine=max(0.0,-dot(normal,sunDir))*0.03;
        moonCol+=vec3(0.05,0.08,0.12)*earthshine;
        float limb=pow(1.0-normal.z,3.0);
        moonCol*=1.0-limb*0.3;
        col=mix(col,moonCol,moonMask);
    }
    float glowR=moonR*1.3;
    float glow=smoothstep(glowR,moonR,moonDist)*0.05;
    col+=vec3(0.3,0.3,0.4)*glow;
    fragColor=vec4(col,1.0);
}
