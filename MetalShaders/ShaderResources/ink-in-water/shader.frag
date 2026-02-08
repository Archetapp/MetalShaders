#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float iiwHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float iiwNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(iiwHash(i),iiwHash(i+vec2(1,0)),f.x),mix(iiwHash(i+vec2(0,1)),iiwHash(i+vec2(1,1)),f.x),f.y);
}
float iiwFbm(vec2 p,float t){
    float v=0.0;float a=0.5;
    mat2 rot=mat2(0.8,-0.6,0.6,0.8);
    for(int i=0;i<6;i++){v+=a*iiwNoise(p+t*0.1);p=rot*p*2.0;a*=0.5;}
    return v;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.4;
    float spread=min(t*0.3,0.8);
    float dist=length(uv);
    float ink=0.0;
    for(int i=0;i<3;i++){
        float fi=float(i);
        float angle=fi*2.094+t*0.2;
        vec2 offset=vec2(cos(angle),sin(angle))*spread*0.3;
        vec2 p=uv-offset;
        float n=iiwFbm(p*3.0+fi*5.0,t);
        float tendril=exp(-length(p)*3.0/max(spread,0.01));
        ink+=n*tendril;
    }
    ink=smoothstep(0.1,0.6,ink);
    vec3 waterCol=vec3(0.85,0.9,0.95);
    vec3 inkCol1=vec3(0.05,0.02,0.15);
    vec3 inkCol2=vec3(0.15,0.05,0.3);
    vec3 inkMix=mix(inkCol2,inkCol1,ink);
    float edge=smoothstep(0.3,0.5,ink)-smoothstep(0.5,0.8,ink);
    inkMix+=vec3(0.1,0.05,0.2)*edge;
    vec3 col=mix(waterCol,inkMix,smoothstep(0.05,0.3,ink));
    float swirl=iiwNoise(uv*5.0+t*0.3)*0.03;
    col+=swirl;
    fragColor=vec4(col,1.0);
}
