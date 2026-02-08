#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float dsHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 col=vec3(0.92,0.9,0.85);
    float hLines[4];hLines[0]=0.2;hLines[1]=0.45;hLines[2]=0.65;hLines[3]=0.85;
    float vLines[4];vLines[0]=0.15;vLines[1]=0.4;vLines[2]=0.7;vLines[3]=0.9;
    for(int i=0;i<4;i++){
        float hl=hLines[i]+0.02*sin(t*0.3+float(i));
        float hd=smoothstep(0.006,0.0,abs(uv.y-hl));
        col=mix(col,vec3(0.05),hd);
        float vl=vLines[i]+0.02*sin(t*0.2+float(i)*1.5);
        float vd=smoothstep(0.006,0.0,abs(uv.x-vl));
        col=mix(col,vec3(0.05),vd);}
    float cellX=0.0;float cellY=0.0;
    for(int i=0;i<4;i++){if(uv.x>vLines[i])cellX=float(i+1);if(uv.y>hLines[i])cellY=float(i+1);}
    float id=dsHash(vec2(cellX,cellY)+floor(t*0.05));
    if(id>0.85)col=mix(col,vec3(0.85,0.12,0.1),0.9);
    else if(id>0.7)col=mix(col,vec3(0.1,0.15,0.55),0.9);
    else if(id>0.6)col=mix(col,vec3(0.9,0.78,0.1),0.9);
    fragColor=vec4(col,1.0);}
