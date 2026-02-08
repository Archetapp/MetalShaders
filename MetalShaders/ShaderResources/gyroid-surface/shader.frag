#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float gyGyroid(vec3 p){return sin(p.x)*cos(p.y)+sin(p.y)*cos(p.z)+sin(p.z)*cos(p.x);}
float gyMap(vec3 p,float t){float scale=3.0+sin(t*0.3);return abs(gyGyroid(p*scale))/scale-0.03;}
vec3 gyNorm(vec3 p,float t){vec2 e=vec2(0.001,0.0);
    return normalize(vec3(gyMap(p+e.xyy,t)-gyMap(p-e.xyy,t),gyMap(p+e.yxy,t)-gyMap(p-e.yxy,t),gyMap(p+e.yyx,t)-gyMap(p-e.yyx,t)));}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 ro=vec3(2.0*sin(t*0.3),sin(t*0.2),2.0*cos(t*0.3));
    vec3 ta=vec3(0);vec3 fwd=normalize(ta-ro);vec3 right=normalize(cross(fwd,vec3(0,1,0)));vec3 up=cross(right,fwd);
    vec3 rd=normalize(uv.x*right+uv.y*up+1.5*fwd);float d=0.0;
    for(int i=0;i<100;i++){float h=gyMap(ro+rd*d,t);if(abs(h)<0.001||d>8.0)break;d+=h*0.5;}
    vec3 col=vec3(0.05,0.02,0.08);
    if(d<8.0){vec3 p=ro+rd*d;vec3 n=gyNorm(p,t);
        float diff=max(dot(n,normalize(vec3(1,1,0.5))),0.0);
        float spec=pow(max(dot(reflect(-normalize(vec3(1,1,0.5)),n),-rd),0.0),32.0);
        float fresnel=pow(1.0-abs(dot(n,-rd)),3.0);
        vec3 matCol=0.5+0.5*cos(6.28*(p*0.3+vec3(0,0.33,0.67)+t*0.1));
        col=matCol*(0.15+0.5*diff)+vec3(0.8)*spec*0.3+vec3(0.3,0.2,0.5)*fresnel*0.4;
        col*=exp(-d*0.15);}
    fragColor=vec4(col,1.0);}
