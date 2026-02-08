#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 col=vec3(0.05,0.05,0.08);
    vec3 gold=vec3(0.85,0.7,0.3);vec3 darkGold=vec3(0.5,0.35,0.1);
    float scale=4.0;vec2 cell=floor(uv*scale);vec2 f=fract(uv*scale);
    float offset=mod(cell.y,2.0)*0.5;
    vec2 fanCenter=vec2(0.5+offset,0.0);
    vec2 fp=f-fanCenter;
    float angle=atan(fp.y,fp.x);float r=length(fp);
    float fan=smoothstep(0.0,0.01,angle)*smoothstep(3.14159,3.13,angle);
    fan*=smoothstep(0.8,0.78,r);
    float rays=sin(angle*8.0+t*0.5)*0.5+0.5;
    float rings=sin(r*20.0-t)*0.5+0.5;
    float pattern=mix(rays,rings,0.5);
    vec3 fanCol=mix(darkGold,gold,pattern);
    col=mix(col,fanCol,fan);
    float arc=smoothstep(0.005,0.0,abs(r-0.8))*fan;
    for(float ri=0.2;ri<0.8;ri+=0.2){arc+=smoothstep(0.003,0.0,abs(r-ri))*fan*0.5;}
    col+=gold*arc*0.5;
    float rayLines=smoothstep(0.01,0.0,abs(sin(angle*8.0)))*fan*smoothstep(0.1,0.2,r);
    col+=gold*rayLines*0.2;
    fragColor=vec4(col,1.0);}
