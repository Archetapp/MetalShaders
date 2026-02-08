#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float sscSmin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float sscMap(vec3 p,float t){
    float ground=p.y+0.8;
    float s1=length(p-vec3(-0.8,0,0))-0.4;
    float s2=length(p-vec3(0.0,0.2*sin(t)+0.1,0))-0.35;
    float s3=length(p-vec3(0.8,-0.1,0.3*sin(t*0.7)))-0.3;
    vec3 bp=p-vec3(0,-0.4,1);float box=length(max(abs(bp)-vec3(0.8,0.4,0.1),0.0))-0.05;
    float scene=sscSmin(s1,s2,0.3);scene=sscSmin(scene,s3,0.2);
    return min(min(scene,ground),box);}
vec3 sscNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(sscMap(p+e.xyy,t)-sscMap(p-e.xyy,t),sscMap(p+e.yxy,t)-sscMap(p-e.yxy,t),sscMap(p+e.yyx,t)-sscMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(2.5*sin(t*0.2),1.0,2.5*cos(t*0.2));
    vec3 ta=vec3(0,-0.2,0);vec3 fwd=normalize(ta-ro);vec3 right=normalize(cross(fwd,vec3(0,1,0)));vec3 up=cross(right,fwd);
    vec3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<100;i++){float h=sscMap(ro+rd*d,t);if(h<0.001||d>15.0)break;d+=h;}
    vec3 col=mix(vec3(0.4,0.5,0.7),vec3(0.15,0.2,0.4),uv.y+0.5);
    if(d<15.0){vec3 p=ro+rd*d;vec3 n=sscNorm(p,t);
        vec3 l=normalize(vec3(1,1.5,0.5));float diff=max(dot(n,l),0.0);
        float spec=pow(max(dot(reflect(-l,n),-rd),0.0),32.0);
        float ao=0.5+0.5*n.y;
        vec3 mat=p.y<-0.79?vec3(0.4,0.35,0.3):vec3(0.5,0.3,0.6);
        col=mat*(0.15+0.6*diff)*ao+vec3(0.8)*spec*0.3;
        col=mix(col,vec3(0.4,0.5,0.7),1.0-exp(-d*0.1));}
    fragColor=vec4(col,1.0);}
