#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float rfNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float n=rfNoise(uv*3.0+t*0.05)*0.03;
    vec3 bg=vec3(0.15+n,0.12+n,0.1+n);
    float y1=0.25+0.02*sin(t*0.2);float y2=0.55+0.02*cos(t*0.3);float y3=0.78;
    float h=0.08;
    float softness=0.04+0.01*sin(t*0.4);
    float r1=smoothstep(y1-h-softness,y1-h,uv.y)*smoothstep(y1+h+softness,y1+h,uv.y);
    float r2=smoothstep(y2-h*1.2-softness,y2-h*1.2,uv.y)*smoothstep(y2+h*1.2+softness,y2+h*1.2,uv.y);
    float r3=smoothstep(y3-h*0.6-softness,y3-h*0.6,uv.y)*smoothstep(y3+h*0.6+softness,y3+h*0.6,uv.y);
    float margin=0.1;
    float xFade=smoothstep(margin-softness,margin,uv.x)*smoothstep(1.0-margin+softness,1.0-margin,uv.x);
    r1*=xFade;r2*=xFade;r3*=xFade;
    float hueShift=t*0.05;
    vec3 c1=vec3(0.7+0.1*sin(hueShift),0.15,0.1);
    vec3 c2=vec3(0.8,0.55+0.1*sin(hueShift+1.0),0.1);
    vec3 c3=vec3(0.1,0.1,0.3+0.1*sin(hueShift+2.0));
    vec3 col=bg;col=mix(col,c1+n,r1);col=mix(col,c2+n,r2);col=mix(col,c3+n,r3);
    col+=rfNoise(uv*100.0)*0.02-0.01;
    fragColor=vec4(col,1.0);}
