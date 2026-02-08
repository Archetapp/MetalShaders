#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cfNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.02,0.01,0.03);
    vec2 flameUV=uv-vec2(0.0,-0.15);
    float flicker=cfNoise(vec2(t*8.0,0.0))*0.03;
    flameUV.x+=flicker;
    flameUV.x+=sin(flameUV.y*8.0+t*5.0)*0.02*(1.0-flameUV.y);
    float flameH=0.35+0.05*sin(t*3.0);
    float width=0.08*(1.0-flameUV.y/flameH);
    width*=smoothstep(0.0,0.1,flameUV.y);
    float flameMask=smoothstep(width,width-0.02,abs(flameUV.x))*smoothstep(-0.02,0.05,flameUV.y)*smoothstep(flameH,flameH-0.1,flameUV.y);
    float n=cfNoise(vec2(flameUV.x*10.0,flameUV.y*5.0-t*6.0));
    flameMask*=0.7+0.3*n;
    float coreWidth=width*0.3;
    float coreMask=smoothstep(coreWidth,coreWidth-0.01,abs(flameUV.x))*smoothstep(-0.01,0.05,flameUV.y)*smoothstep(flameH*0.5,0.05,flameUV.y);
    vec3 outerFlame=mix(vec3(0.8,0.2,0.0),vec3(1.0,0.7,0.0),flameUV.y/flameH);
    vec3 innerFlame=mix(vec3(0.2,0.3,0.8),vec3(1.0,0.9,0.5),flameUV.y/(flameH*0.5));
    vec3 flameCol=mix(outerFlame,innerFlame,coreMask);
    col+=flameCol*flameMask*1.5;
    float glow=exp(-length(flameUV-vec2(0,0.1))*5.0)*0.3;
    col+=vec3(0.4,0.15,0.02)*glow;
    float wickY=-0.02;
    float wickMask=smoothstep(0.003,0.0,abs(flameUV.x))*smoothstep(wickY-0.1,wickY,flameUV.y)*smoothstep(0.03,0.0,flameUV.y);
    col=mix(col,vec3(0.05),wickMask);
    fragColor=vec4(col,1.0);
}
