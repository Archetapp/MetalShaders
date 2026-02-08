#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float hsNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;
    float horizonY=0.35;
    float distortStrength=smoothstep(horizonY+0.3,horizonY,uv.y)*0.02;
    float n1=hsNoise(vec2(uv.x*8.0,uv.y*15.0-t*2.0));
    float n2=hsNoise(vec2(uv.x*12.0+5.0,uv.y*20.0-t*3.0));
    vec2 distort=vec2(n1-0.5,n2-0.5)*distortStrength;
    vec2 duv=uv+distort;
    vec3 sky=mix(vec3(0.9,0.85,0.7),vec3(0.4,0.55,0.8),smoothstep(horizonY,0.9,duv.y));
    float haze=exp(-(duv.y-horizonY)*3.0)*step(horizonY,duv.y)*0.3;
    sky+=vec3(0.3,0.25,0.15)*haze;
    vec3 ground=mix(vec3(0.85,0.75,0.55),vec3(0.7,0.6,0.4),smoothstep(0.0,horizonY,duv.y));
    vec3 col=duv.y>horizonY?sky:ground;
    float roadY=horizonY*0.8;
    float roadMask=smoothstep(roadY+0.05,roadY,duv.y)*smoothstep(0.0,roadY*0.3,duv.y);
    col=mix(col,vec3(0.25,0.25,0.25),roadMask*0.6);
    float mirage=smoothstep(horizonY,horizonY-0.1,duv.y)*distortStrength*20.0;
    col=mix(col,sky*0.8,mirage*0.5);
    float shimmerVis=abs(distort.x+distort.y)*200.0;
    col+=vec3(0.1)*shimmerVis*smoothstep(horizonY+0.2,horizonY,uv.y);
    fragColor=vec4(col,1.0);
}
