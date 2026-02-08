#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float smSphere(vec3 p,float r){return length(p)-r;}
float smTorus(vec3 p,vec2 tr){vec2 q=vec2(length(p.xz)-tr.x,p.y);return length(q)-tr.y;}
float smBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float smMap(vec3 p,float t){
    float morph=sin(t*0.5)*0.5+0.5;
    float a=smSphere(p,0.8);float b=smTorus(p,vec2(0.6,0.25));float c=smBox(p,vec3(0.55));
    float phase=mod(t*0.2,3.0);
    if(phase<1.0)return mix(a,b,smoothstep(0.0,1.0,fract(phase)));
    if(phase<2.0)return mix(b,c,smoothstep(0.0,1.0,fract(phase)));
    return mix(c,a,smoothstep(0.0,1.0,fract(phase)));}
vec3 smNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(smMap(p+e.xyy,t)-smMap(p-e.xyy,t),smMap(p+e.yxy,t)-smMap(p-e.yxy,t),smMap(p+e.yyx,t)-smMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(2.0*sin(t*0.3),1.0,2.0*cos(t*0.3));
    vec3 ta=vec3(0);vec3 fwd=normalize(ta-ro);vec3 right=normalize(cross(fwd,vec3(0,1,0)));vec3 up=cross(right,fwd);
    vec3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<80;i++){float h=smMap(ro+rd*d,t);if(h<0.001||d>10.0)break;d+=h;}
    vec3 col=vec3(0.08,0.06,0.12);
    if(d<10.0){vec3 p=ro+rd*d;vec3 n=smNorm(p,t);
        float diff=max(dot(n,normalize(vec3(1,1,0.5))),0.0);
        float spec=pow(max(dot(reflect(-normalize(vec3(1,1,0.5)),n),-rd),0.0),32.0);
        float hue=mod(t*0.2,3.0)/3.0;
        vec3 baseCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col=baseCol*(0.15+0.6*diff)+vec3(0.9)*spec*0.4;}
    fragColor=vec4(col,1.0);}
