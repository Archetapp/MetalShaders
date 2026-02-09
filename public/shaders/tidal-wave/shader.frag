#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float twHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

float twNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=twHash(i);float b=twHash(i+vec2(1,0));
    float c=twHash(i+vec2(0,1));float d=twHash(i+vec2(1,1));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

float twFbm(vec2 p){
    float v=0.0;float a=0.5;
    mat2 rot=mat2(0.8,0.6,-0.6,0.8);
    for(int i=0;i<6;i++){v+=a*twNoise(p);p=rot*p*2.0;a*=0.5;}
    return v;
}

float twOceanH(vec2 p,float t){
    float h=0.0;
    h+=sin(p.x*0.7+t*0.8)*0.35;
    h+=sin(p.x*1.4+p.y*0.4+t*1.2)*0.2;
    h+=sin(p.x*2.8-p.y*1.0+t*1.8)*0.1;
    h+=sin(p.y*1.8+p.x*0.7+t*0.9)*0.12;
    float big=sin(p.x*0.2+t*0.45)*0.55;
    float crest=pow(max(0.0,sin(p.x*0.4+t*0.6)),5.0)*0.45;
    h+=big+crest;
    h+=twFbm(p*3.0+t*0.35)*0.07;
    h+=twFbm(p*7.0+t*0.15)*0.03;
    return h;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/min(iResolution.x,iResolution.y);
    float t=iTime;
    vec2 mouseUV=iMouse/iResolution;
    bool hasInput=iMouse.x>0.0||iMouse.y>0.0;

    float horizY=0.05;
    float perspY=uv.y-horizY;
    float persp=1.0/(max(perspY,0.001)*2.5+1.0);
    vec2 wp=vec2(uv.x*persp*6.0,persp*10.0);
    float shiftX=hasInput?(mouseUV.x-0.5)*0.5:0.0;
    wp.x+=shiftX;
    wp.y+=t*1.2;

    float oceanMask=smoothstep(horizY-0.01,horizY+0.02,uv.y);

    vec3 skyTop=vec3(0.12,0.22,0.5);
    vec3 skyHoriz=vec3(0.55,0.38,0.32);
    vec3 skyCol=mix(skyHoriz,skyTop,smoothstep(horizY,0.5,uv.y+0.3));

    float sunSX=hasInput?(mouseUV.x-0.5)*0.6:0.0;
    float sunSY=hasInput?(mouseUV.y-0.5)*0.4:0.0;
    vec2 sunPos=vec2(0.2+sunSX,0.25+sunSY);
    float sunD=length(uv-sunPos);
    skyCol+=vec3(1.0,0.7,0.4)*exp(-sunD*4.0)*0.6;
    skyCol=mix(skyCol,vec3(1.0,0.9,0.7),smoothstep(0.04,0.035,sunD));

    float h=twOceanH(wp,t);
    float eps=0.02;
    float hx=twOceanH(wp+vec2(eps,0),t);
    float hy=twOceanH(wp+vec2(0,eps),t);
    vec3 N=normalize(vec3(-(hx-h)/eps*0.4,1.0,-(hy-h)/eps*0.4));

    vec3 sunDir=normalize(vec3(0.3+sunSX,0.5+sunSY,-0.6));
    vec3 V=normalize(vec3(0.0,0.3,-1.0));
    float diff=max(dot(N,sunDir),0.0);
    float spec=pow(max(dot(N,normalize(sunDir+V)),0.0),80.0);
    float fresnel=pow(1.0-max(dot(N,V),0.0),3.5);

    vec3 deepC=vec3(0.0,0.03,0.1);
    vec3 midC=vec3(0.0,0.12,0.28);
    vec3 shallC=vec3(0.04,0.32,0.42);
    float depth=smoothstep(-0.4,0.5,h);
    vec3 wc=mix(deepC,midC,smoothstep(0.0,0.4,depth));
    wc=mix(wc,shallC,smoothstep(0.4,0.8,depth));

    vec3 oc=wc*0.4;
    oc+=wc*diff*0.6;
    oc+=vec3(1.0,0.85,0.6)*spec*2.0;
    oc+=vec3(0.4,0.5,0.6)*fresnel*0.25;

    float foam=smoothstep(0.25,0.5,h);
    float foamD=twFbm(wp*6.0+t*0.5);
    foam*=smoothstep(0.3,0.6,foamD);
    foam+=smoothstep(0.85,1.0,twFbm(wp*4.0+t*0.7))*0.2;
    foam=clamp(foam,0.0,1.0);
    oc=mix(oc,vec3(0.75,0.82,0.88),foam*0.65);

    float sss=pow(max(0.0,dot(V,-sunDir+N*0.3)),3.0);
    oc+=vec3(0.0,0.25,0.2)*sss*0.2*smoothstep(0.1,0.4,h);

    float spray=pow(twFbm(wp*12.0+t*2.5),4.0)*foam;
    oc+=vec3(0.85)*spray*0.4;

    float reflX=uv.x-sunPos.x;
    float reflSp=0.08+perspY*0.3;
    float sunRefl=exp(-reflX*reflX/(reflSp*reflSp));
    sunRefl*=smoothstep(horizY,horizY+0.05,uv.y);
    oc+=vec3(1.0,0.8,0.5)*sunRefl*twNoise(wp*8.0+t*2.0)*0.4;

    vec3 col=mix(skyCol,oc,oceanMask);
    float fog=exp(-abs(perspY)*8.0)*oceanMask;
    col=mix(col,vec3(0.5,0.45,0.4),fog*0.35);
    col=pow(col,vec3(0.93));
    col=clamp(col,0.0,1.0);
    fragColor=vec4(col,1.0);
}
