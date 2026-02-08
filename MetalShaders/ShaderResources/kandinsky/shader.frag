#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float kdHash(float p){return fract(sin(p*127.1)*43758.5);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.92,0.88,0.82);
    for(int i=0;i<8;i++){float fi=float(i);
        vec2 center=vec2(kdHash(fi*3.0)-0.5,kdHash(fi*3.0+1.0)-0.5)*0.7;
        center+=vec2(sin(t*0.3+fi),cos(t*0.4+fi*1.3))*0.05;
        float r=0.05+kdHash(fi*3.0+2.0)*0.12;
        float d=length(uv-center);
        float circle=smoothstep(r,r-0.003,d);
        float idx=mod(fi,4.0);
        vec3 c;
        if(idx<1.0)c=vec3(0.8,0.15,0.1);else if(idx<2.0)c=vec3(0.1,0.15,0.6);
        else if(idx<3.0)c=vec3(0.9,0.75,0.1);else c=vec3(0.15);
        col=mix(col,c,circle*0.8);
        float ring=smoothstep(0.003,0.0,abs(d-r));
        col=mix(col,vec3(0.1),ring);}
    for(int i=0;i<5;i++){float fi=float(i);
        vec2 a=vec2(kdHash(fi*5.0+10.0)-0.5,kdHash(fi*5.0+11.0)-0.5)*0.8;
        vec2 b=vec2(kdHash(fi*5.0+12.0)-0.5,kdHash(fi*5.0+13.0)-0.5)*0.8;
        vec2 ab=b-a;float len=length(ab);vec2 dir=ab/len;
        vec2 perp=vec2(-dir.y,dir.x);
        float proj=dot(uv-a,dir);proj=clamp(proj,0.0,len);
        vec2 closest=a+dir*proj;
        float d=length(uv-closest);
        col=mix(col,vec3(0.1),smoothstep(0.003,0.0,d));}
    fragColor=vec4(col,1.0);}
