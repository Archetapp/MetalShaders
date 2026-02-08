#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float ssbSmin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}
float ssbMap(vec3 p,float t){
    float d=1e10;
    for(int i=0;i<4;i++){float fi=float(i);
        vec3 offset=vec3(sin(t*0.5+fi*1.57),cos(t*0.3+fi*2.0),sin(t*0.7+fi*1.3))*0.7;
        float sphere=length(p-offset)-0.4;
        d=ssbSmin(d,sphere,0.5+0.3*sin(t*0.2));}
    return d;}
vec3 ssbNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(ssbMap(p+e.xyy,t)-ssbMap(p-e.xyy,t),ssbMap(p+e.yxy,t)-ssbMap(p-e.yxy,t),ssbMap(p+e.yyx,t)-ssbMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(0,0,3.5),rd=normalize(vec3(uv,-1.5));float d=0.0;
    for(int i=0;i<80;i++){float h=ssbMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    vec3 col=vec3(0.1,0.05,0.15);
    if(d<10.0){vec3 p=ro+rd*d;vec3 n=ssbNorm(p,t);
        vec3 light=normalize(vec3(sin(t*0.3),1,cos(t*0.4)));
        float diff=max(dot(n,light),0.0);float spec=pow(max(dot(reflect(-light,n),-rd),0.0),64.0);
        float fresnel=pow(1.0-max(dot(n,-rd),0.0),3.0);
        col=vec3(0.3,0.1,0.5)*(0.2+0.5*diff)+vec3(0.5,0.3,0.8)*fresnel*0.5+vec3(1.0)*spec*0.4;}
    fragColor=vec4(col,1.0);}
