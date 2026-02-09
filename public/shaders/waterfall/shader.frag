#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float wfHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float wfNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(wfHash(i),wfHash(i+vec2(1,0)),f.x),mix(wfHash(i+vec2(0,1)),wfHash(i+vec2(1,1)),f.x),f.y);
}
float wfFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<6;i++){v+=a*wfNoise(p);p*=2.0;a*=0.5;}return v;}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;

    float rockN=wfFbm(uv*vec2(8.0,14.0)+0.5);
    float rockD=wfFbm(uv*vec2(25.0,35.0));
    vec3 rockCol=mix(vec3(0.12,0.1,0.08),vec3(0.28,0.22,0.18),rockN);
    rockCol+=rockD*0.06;
    float moss=wfFbm(uv*vec2(5.0,9.0)+3.0)*smoothstep(0.35,0.75,uv.y);
    rockCol=mix(rockCol,vec3(0.08,0.18,0.04),moss*0.25);
    vec3 col=rockCol;

    float cx=0.5;
    float fw=0.15;
    float dist=abs(uv.x-cx);
    float waterMask=smoothstep(fw+0.01,fw-0.04,dist);

    float flow1=wfNoise(vec2(uv.x*35.0,uv.y*5.0-t*9.0));
    float flow2=wfNoise(vec2(uv.x*55.0,uv.y*3.5-t*12.0));
    float flow3=wfNoise(vec2(uv.x*18.0,uv.y*7.0-t*7.0));
    float flowP=flow1*0.5+flow2*0.3+flow3*0.2;

    vec3 waterCol=mix(vec3(0.35,0.55,0.75),vec3(0.82,0.9,1.0),flowP);
    float bright=pow(wfNoise(vec2(uv.x*45.0,uv.y*2.5-t*14.0)),2.0);
    waterCol+=vec3(0.25)*bright;
    waterCol*=mix(0.65,1.0,smoothstep(fw,0.0,dist));
    float edgeFoam=smoothstep(fw-0.04,fw-0.01,dist)*waterMask;
    waterCol=mix(waterCol,vec3(0.9,0.95,1.0),edgeFoam*0.3);
    col=mix(col,waterCol,waterMask);

    float baseY=0.1;
    float poolMask=smoothstep(baseY+0.04,baseY-0.03,uv.y);
    float poolW=smoothstep(0.45,0.08,abs(uv.x-cx));
    float ripple=sin((length(vec2(uv.x-cx,(uv.y-baseY)*3.0))*35.0-t*4.0))*0.5+0.5;
    vec3 poolCol=mix(vec3(0.08,0.15,0.3),vec3(0.25,0.4,0.55),ripple*0.3);
    float poolFoam=wfNoise(vec2(uv.x*20.0+t*2.0,uv.y*30.0))*smoothstep(0.02,0.0,abs(uv.y-baseY))*poolW;
    poolCol=mix(poolCol,vec3(0.85,0.9,0.95),poolFoam*0.5);
    col=mix(col,poolCol,poolMask*poolW);

    float impD=length(vec2((uv.x-cx)*2.0,uv.y-baseY));
    float splash=smoothstep(0.18,0.0,impD);
    float splN=wfNoise(vec2(uv.x*18.0+t*3.5,uv.y*22.0+t*2.5));
    col=mix(col,vec3(0.88,0.93,1.0),splash*splN*0.7);

    float sZ=smoothstep(baseY+0.12,baseY,uv.y);
    float sprayD=length(vec2(uv.x-cx,uv.y-baseY));
    float sideSpray=smoothstep(0.22,0.04,sprayD)*sZ;
    float sprayP=wfNoise(vec2(atan(uv.y-baseY,uv.x-cx)*6.0+t,sprayD*25.0-t*6.0));
    col+=vec3(0.5,0.6,0.7)*sideSpray*sprayP*0.35;

    float mistY=smoothstep(baseY-0.03,baseY+0.25,uv.y);
    float mistX=smoothstep(0.3,0.04,abs(uv.x-cx));
    float mistP=wfFbm(vec2(uv.x*4.5+t*0.35,uv.y*3.5-t*0.9));
    float mist=mistY*(1.0-mistY)*mistX*mistP;
    col=mix(col,vec3(0.65,0.7,0.8),mist*0.35);

    col*=mix(0.55,1.0,uv.y*0.65+0.35);
    float vig=1.0-0.3*pow(length(uv-0.5)*1.3,2.0);
    col*=vig;
    col=clamp(col,0.0,1.0);
    fragColor=vec4(col,1.0);
}
