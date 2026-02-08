#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float ceHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 ceRandom(vec2 p){return vec2(ceHash(p),ceHash(p+vec2(37.0,71.0)));}
float ceNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(ceHash(i),ceHash(i+vec2(1,0)),f.x),mix(ceHash(i+vec2(0,1)),ceHash(i+vec2(1,1)),f.x),f.y);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float scale=8.0;vec2 p=uv*scale;
    float minD=10.0,secD=10.0;vec2 closest=vec2(0.0);
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        vec2 cell=floor(p)+vec2(float(x),float(y));
        vec2 pt=cell+ceRandom(cell)*0.8+0.1;
        float d=length(p-pt);
        if(d<minD){secD=minD;minD=d;closest=cell;}else if(d<secD){secD=d;}}
    float crack=secD-minD;
    float crackLine=1.0-smoothstep(0.0,0.06,crack);
    float deepCrack=1.0-smoothstep(0.0,0.02,crack);
    float n=ceNoise(uv*20.0)*0.1+ceNoise(uv*40.0)*0.05;
    vec3 mudLight=vec3(0.55,0.42,0.28);
    vec3 mudDark=vec3(0.35,0.25,0.15);
    vec3 crackCol=vec3(0.12,0.08,0.05);
    float cellN=ceHash(closest);
    vec3 col=mix(mudDark,mudLight,cellN*0.5+0.25+n);
    col=mix(col,crackCol,crackLine);
    col=mix(col,crackCol*0.5,deepCrack);
    vec2 lp=vec2(0.5+0.1*sin(t*0.3),0.6);
    float light=max(0.0,1.0-length(uv-lp)*1.5);
    col*=0.7+light*0.4;
    col+=vec3(0.02)*smoothstep(0.03,0.06,crack)*smoothstep(0.1,0.06,crack);
    fragColor=vec4(col,1.0);}
