#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float nsHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nsNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(nsHash(i),nsHash(i+vec2(1,0)),f.x),mix(nsHash(i+vec2(0,1)),nsHash(i+vec2(1,1)),f.x),f.y);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.02;
    vec3 col=mix(vec3(0.0,0.0,0.02),vec3(0.02,0.02,0.08),uv.y);
    float milky=0.0;
    vec2 muv=uv-vec2(0.5,0.5);
    muv=mat2(0.95,-0.3,0.3,0.95)*muv;
    float band=exp(-muv.y*muv.y*50.0);
    milky=nsNoise((muv+vec2(t,0))*vec2(3.0,8.0))*band;
    milky+=nsNoise((muv+vec2(t*0.5,0))*vec2(6.0,15.0))*band*0.5;
    col+=vec3(0.15,0.12,0.2)*milky*0.4;
    col+=vec3(0.1,0.08,0.15)*band*0.15;
    for(float layer=0.0;layer<3.0;layer++){
        float scale=200.0+layer*150.0;
        vec2 starUV=floor(uv*scale);
        float h=nsHash(starUV+layer*100.0);
        if(h>0.97){
            vec2 starPos=(starUV+0.5)/scale;
            float d=length(gl_FragCoord.xy/iResolution.xy-starPos)*scale;
            float brightness=(h-0.97)/0.03;
            float twinkle=0.7+0.3*sin(t*50.0+h*100.0);
            float star=brightness*twinkle*smoothstep(1.5,0.0,d);
            vec3 starCol=mix(vec3(0.8,0.85,1.0),vec3(1.0,0.9,0.7),nsHash(starUV*3.0));
            col+=starCol*star*0.8;
        }
    }
    float shootStar=fract(t*2.0);
    if(shootStar<0.1){
        vec2 ssStart=vec2(0.3+nsHash(vec2(floor(t*2.0)))*0.5,0.7+nsHash(vec2(floor(t*2.0)+1.0))*0.2);
        vec2 ssEnd=ssStart+vec2(0.15,-0.08);
        vec2 ssPos=mix(ssStart,ssEnd,shootStar*10.0);
        float ssd=length(uv-ssPos);
        col+=vec3(1.0)*exp(-ssd*500.0)*0.5;
    }
    fragColor=vec4(col,1.0);
}
