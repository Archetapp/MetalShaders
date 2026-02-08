#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float sndHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float sndNoise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(mix(sndHash(i),sndHash(i+vec3(1,0,0)),f.x),
                   mix(sndHash(i+vec3(0,1,0)),sndHash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(sndHash(i+vec3(0,0,1)),sndHash(i+vec3(1,0,1)),f.x),
                   mix(sndHash(i+vec3(0,1,1)),sndHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float sndMap(vec3 p,float t){float sphere=length(p)-0.8;
    float disp=sndNoise(p*3.0+t*0.5)*0.3+sndNoise(p*6.0+t*0.3)*0.15;
    return sphere+disp;}
vec3 sndNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(sndMap(p+e.xyy,t)-sndMap(p-e.xyy,t),sndMap(p+e.yxy,t)-sndMap(p-e.yxy,t),sndMap(p+e.yyx,t)-sndMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(0,0,3),rd=normalize(vec3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=sndMap(ro+rd*d,t);if(abs(h)<0.001||d>10.0)break;d+=h*0.7;}
    vec3 col=vec3(0.05,0.05,0.1);
    if(d<10.0){vec3 p=ro+rd*d;vec3 n=sndNorm(p,t);
        vec3 l=normalize(vec3(1,1,1));float diff=max(dot(n,l),0.0);
        float spec=pow(max(dot(reflect(-l,n),-rd),0.0),32.0);
        float fresnel=pow(1.0-max(dot(n,-rd),0.0),3.0);
        vec3 baseCol=0.5+0.5*cos(6.28*(sndNoise(p*2.0)*0.5+t*0.1+vec3(0,0.33,0.67)));
        col=baseCol*(0.2+0.5*diff)+vec3(0.8)*spec*0.4+vec3(0.3,0.4,0.6)*fresnel*0.3;}
    fragColor=vec4(col,1.0);}
