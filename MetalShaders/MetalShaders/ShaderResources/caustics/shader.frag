#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float csNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);
    f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

float csCaustic(vec2 p,float t){
    float v=0.0;
    float a=0.5;
    for(int i=0;i<5;i++){
        float n=csNoise(p);
        v+=abs(sin(n*6.2832+t))*a;
        p=p*2.0+vec2(t*0.1);
        a*=0.5;
    }
    return v;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.8;
    float c1=csCaustic(uv*3.0,t);
    float c2=csCaustic(uv*3.0+5.0,t*1.3);
    float c=c1*c2;
    c=pow(c,1.5)*3.0;
    vec3 deep=vec3(0.0,0.05,0.15);
    vec3 light=vec3(0.1,0.5,0.7);
    vec3 bright=vec3(0.3,0.8,0.9);
    vec3 col=deep+light*c+bright*c*c*0.5;
    col+=vec3(0.05,0.1,0.15)*sin(uv.y*10.0+t)*0.3;
    fragColor=vec4(col,1.0);
}
