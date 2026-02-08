#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float wxNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float r=length(uv);
    vec2 lightPos=vec2(0.2*sin(t*0.5),0.2*cos(t*0.3));
    float lightDist=length(uv-lightPos);
    float sss=exp(-lightDist*3.0)*0.8;
    float deepScatter=exp(-lightDist*1.5)*0.4;
    vec3 waxBase=vec3(0.85,0.75,0.55);
    vec3 sssColor=vec3(1.0,0.6,0.3);
    vec3 deepColor=vec3(0.8,0.2,0.1);
    vec3 col=waxBase*0.3;
    col+=sssColor*sss;
    col+=deepColor*deepScatter;
    float n=wxNoise(uv*10.0+t*0.1)*0.1;
    col+=n*waxBase;
    float fresnel=pow(smoothstep(0.0,0.45,r),2.0);
    col=mix(col,col*0.5,fresnel);
    float spec=pow(max(0.0,1.0-lightDist*4.0),16.0);
    col+=vec3(1.0,0.95,0.85)*spec*0.5;
    float surface=1.0-smoothstep(0.4,0.42,r);
    col*=surface;
    float rimGlow=smoothstep(0.35,0.4,r)*smoothstep(0.42,0.4,r);
    col+=sssColor*rimGlow*0.5;
    fragColor=vec4(col,1.0);}
