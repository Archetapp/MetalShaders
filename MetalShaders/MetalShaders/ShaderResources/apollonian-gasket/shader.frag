#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.06);
    float minDist=1e5;int depth=0;
    vec2 p=uv*2.0;
    for(int iter=0;iter<8;iter++){
        float r=length(p);float a=atan(p.y,p.x)+t*0.1;
        if(r<0.01)break;
        float d=abs(r-1.0);
        if(d<minDist){minDist=d;depth=iter;}
        float invR=1.0/(r*r);
        p=p*invR;
        p.x+=1.0+0.1*sin(t*0.3+float(iter));
        float scale=2.0+0.5*sin(t*0.2);
        p*=scale;p=p-floor(p+0.5);}
    float hue=float(depth)*0.125+t*0.05;
    vec3 circCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    float line=smoothstep(0.05,0.0,minDist);
    col+=circCol*line*0.8;
    float glow=0.02/(minDist+0.02);
    col+=circCol*glow*0.2;
    float outerCircle=abs(length(uv*2.0)-1.0);
    col+=vec3(0.5)*smoothstep(0.02,0.0,outerCircle);
    fragColor=vec4(col,1.0);}
