#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float srMap(vec3 p,float t){
    float rep=2.0;vec3 q=p-rep*floor(p/rep+0.5);
    float sphere=length(q)-0.3-0.1*sin(t+p.x*0.5)*sin(p.z*0.5);
    return sphere;}
vec3 srNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(srMap(p+e.xyy,t)-srMap(p-e.xyy,t),srMap(p+e.yxy,t)-srMap(p-e.yxy,t),srMap(p+e.yyx,t)-srMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(t*0.5,1.0+sin(t*0.3),t*0.3);
    vec3 rd=normalize(vec3(uv,-1.5));
    float ca=t*0.1,sa=sin(ca),cs=cos(ca);
    rd.xz=mat2(cs,-sa,sa,cs)*rd.xz;
    float d=0.0;
    for(int i=0;i<80;i++){float h=srMap(ro+rd*d,t);if(h<0.001||d>20.0)break;d+=h;}
    vec3 col=vec3(0.02,0.02,0.05);
    if(d<20.0){vec3 p=ro+rd*d;vec3 n=srNorm(p,t);
        float diff=max(dot(n,normalize(vec3(1,1,0.5))),0.0);
        float spec=pow(max(dot(reflect(-normalize(vec3(1,1,0.5)),n),-rd),0.0),32.0);
        float fog=exp(-d*0.08);
        vec3 id=floor(p/2.0+0.5);float hue=fract(dot(id,vec3(0.1,0.2,0.3)));
        vec3 baseCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col=(baseCol*(0.2+0.6*diff)+vec3(0.8)*spec*0.3)*fog;}
    fragColor=vec4(col,1.0);}
