#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float sbSphere(vec3 p,float r){return length(p)-r;}
float sbBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float sbUnion(float a,float b){return min(a,b);}
float sbIntersect(float a,float b){return max(a,b);}
float sbSubtract(float a,float b){return max(a,-b);}
float sbMap(vec3 p,float t){
    float mode=mod(t*0.15,3.0);
    float s=sbSphere(p,0.8);float b=sbBox(p-vec3(0.3*sin(t*0.5)),vec3(0.6));
    if(mode<1.0)return sbUnion(s,b);
    if(mode<2.0)return sbIntersect(s,b);
    return sbSubtract(s,b);}
vec3 sbNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(sbMap(p+e.xyy,t)-sbMap(p-e.xyy,t),sbMap(p+e.yxy,t)-sbMap(p-e.yxy,t),sbMap(p+e.yyx,t)-sbMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(0,0,3),rd=normalize(vec3(uv,-1.5));
    float d=0.0;
    for(int i=0;i<64;i++){vec3 p=ro+rd*d;float h=sbMap(p,t);if(h<0.001||d>10.0)break;d+=h;}
    vec3 col=vec3(0.05,0.05,0.1);
    if(d<10.0){vec3 p=ro+rd*d;vec3 n=sbNorm(p,t);
        vec3 light=normalize(vec3(1,1,1));float diff=max(dot(n,light),0.0);
        float spec=pow(max(dot(reflect(-light,n),-rd),0.0),32.0);
        float mode=mod(t*0.15,3.0);
        vec3 baseCol=mode<1.0?vec3(0.2,0.5,0.8):mode<2.0?vec3(0.8,0.3,0.2):vec3(0.2,0.8,0.3);
        col=baseCol*(0.2+0.6*diff)+vec3(0.8)*spec*0.5;}
    fragColor=vec4(col,1.0);}
