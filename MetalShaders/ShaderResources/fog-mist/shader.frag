#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fmNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float fmFbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<6;i++){v+=a*fmNoise(p);p*=2.0;a*=0.5;}return v;}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.1;
    vec3 bg=mix(vec3(0.15,0.18,0.12),vec3(0.3,0.35,0.25),uv.y);
    float treeSil=smoothstep(0.4,0.42,uv.y)*0.3;
    float treeNoise=fmNoise(vec2(uv.x*10.0,0.0));
    float treeH=0.35+treeNoise*0.15;
    treeSil=smoothstep(treeH,treeH+0.01,uv.y)*(1.0-smoothstep(treeH+0.15,treeH+0.3,uv.y));
    bg=mix(bg,vec3(0.05,0.08,0.03),treeSil*0.8);
    vec3 col=bg;
    for(int i=0;i<5;i++){
        float fi=float(i);
        float speed=0.05+fi*0.02;
        float scale=2.0+fi*0.5;
        float density=0.3+fi*0.1;
        float fog=fmFbm(vec2(uv.x*scale+t*speed+fi*3.0,uv.y*scale*0.5+fi*2.0));
        float mask=smoothstep(0.3,0.6,fog);
        float heightFade=smoothstep(0.0,0.3+fi*0.1,uv.y)*smoothstep(0.8,0.5-fi*0.05,uv.y);
        float depth=1.0-fi*0.15;
        vec3 fogCol=vec3(0.7,0.75,0.8)*depth;
        col=mix(col,fogCol,mask*heightFade*density);
    }
    float ground=smoothstep(0.15,0.0,uv.y);
    col=mix(col,vec3(0.1,0.12,0.08),ground);
    fragColor=vec4(col,1.0);
}
