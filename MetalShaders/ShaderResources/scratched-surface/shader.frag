#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float scHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 metal=vec3(0.5,0.5,0.52);
    vec2 lightDir=normalize(vec2(sin(t*0.5),cos(t*0.3)));
    float scratches=0.0;
    for(int i=0;i<15;i++){float fi=float(i);
        float angle=scHash(vec2(fi,0.0))*3.14159*0.5-0.785;
        float offset=scHash(vec2(fi,1.0));
        float cs=cos(angle),sn=sin(angle);
        vec2 ruv=vec2(uv.x*cs-uv.y*sn,uv.x*sn+uv.y*cs);
        float line=smoothstep(0.002,0.0,abs(ruv.y-offset));
        float len=smoothstep(0.0,0.1,ruv.x)*smoothstep(1.0,0.9,ruv.x);
        float depth=0.3+scHash(vec2(fi,2.0))*0.7;
        scratches+=line*len*depth;}
    scratches=min(scratches,1.0);
    float aniso=dot(lightDir,vec2(0.7,0.7));
    float specAniso=pow(max(0.0,aniso),8.0)*scratches;
    vec3 col=metal*(1.0-scratches*0.2);
    col+=vec3(0.8,0.8,0.85)*specAniso*0.5;
    float mainSpec=pow(max(0.0,1.0-length(uv-vec2(0.5+0.2*sin(t*0.4),0.5+0.2*cos(t*0.3)))*2.5),6.0);
    col+=vec3(0.4)*mainSpec;
    fragColor=vec4(col,1.0);}
