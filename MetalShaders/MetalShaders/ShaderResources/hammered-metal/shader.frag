#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float hmHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float scale=15.0;vec2 p=uv*scale;
    vec3 col=vec3(0.55,0.45,0.35);
    vec2 lightPos=vec2(0.5+0.3*sin(t*0.4),0.5+0.3*cos(t*0.3));
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        vec2 cell=floor(p)+vec2(float(x),float(y));
        vec2 center=cell+vec2(hmHash(cell),hmHash(cell+vec2(1.0)))*0.6+0.2;
        float d=length(p-center);
        float dimple=smoothstep(0.45,0.0,d);
        vec2 normal=normalize(p-center+0.001);
        vec2 toLight=normalize(lightPos*scale-p);
        float nDotL=dot(normal,toLight);
        float spec=pow(max(0.0,nDotL),16.0)*dimple;
        float diff=max(0.0,nDotL*0.5+0.5)*dimple;
        col+=vec3(0.3,0.25,0.2)*diff*0.3;
        col+=vec3(0.9,0.85,0.7)*spec*0.5;
        col-=dimple*0.1;}
    float mainSpec=pow(max(0.0,1.0-length(uv-lightPos)*2.5),8.0);
    col+=vec3(0.4,0.35,0.25)*mainSpec;
    fragColor=vec4(col,1.0);}
