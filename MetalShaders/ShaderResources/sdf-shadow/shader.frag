#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float sshMap(vec3 p,float t){
    float plane=p.y+0.5;
    float sphere=length(p-vec3(0,0.3*sin(t)+0.2,0))-0.5;
    float box=length(max(abs(p-vec3(1.0,0,0.5*sin(t*0.7)))-vec3(0.3),0.0));
    return min(plane,min(sphere,box));}
float sshSoftShadow(vec3 ro,vec3 rd,float mint,float maxt,float k,float t){
    float res=1.0;float d=mint;
    for(int i=0;i<32;i++){float h=sshMap(ro+rd*d,t);
        res=min(res,k*h/d);d+=clamp(h,0.02,0.2);if(h<0.001||d>maxt)break;}
    return clamp(res,0.0,1.0);}
vec3 sshNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(sshMap(p+e.xyy,t)-sshMap(p-e.xyy,t),sshMap(p+e.yxy,t)-sshMap(p-e.yxy,t),sshMap(p+e.yyx,t)-sshMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(0,1.5,3),rd=normalize(vec3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=sshMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    vec3 col=vec3(0.4,0.5,0.7);
    if(d<10.0){vec3 p=ro+rd*d;vec3 n=sshNorm(p,t);
        vec3 light=normalize(vec3(sin(t*0.3),1.5,cos(t*0.4)));
        float diff=max(dot(n,light),0.0);
        float shadow=sshSoftShadow(p+n*0.01,light,0.02,5.0,16.0,t);
        float ao=0.5+0.5*n.y;
        col=vec3(0.6,0.55,0.5)*(0.1+0.6*diff*shadow)*ao;
        if(p.y>-0.49)col=mix(col,vec3(0.3,0.5,0.7),0.3);}
    fragColor=vec4(col,1.0);}
