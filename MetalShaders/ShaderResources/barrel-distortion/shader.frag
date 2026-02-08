#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec2 center=vec2(0.5);vec2 d=uv-center;
    float r2=dot(d,d);
    float k=0.3+0.2*sin(t*0.5);
    vec2 distorted=center+d*(1.0+k*r2+k*0.5*r2*r2);
    vec3 col=vec3(0.0);
    if(distorted.x>=0.0&&distorted.x<=1.0&&distorted.y>=0.0&&distorted.y<=1.0){
        float checker=mod(floor(distorted.x*15.0)+floor(distorted.y*15.0),2.0);
        col=mix(vec3(0.8,0.2,0.3),vec3(0.2,0.3,0.8),checker);
        float circles=0.0;
        for(int i=0;i<4;i++){float fi=float(i);
            vec2 p=vec2(0.25+fi*0.2,0.5+0.15*sin(t+fi));
            circles+=smoothstep(0.08,0.06,length(distorted-p));}
        col=mix(col,vec3(1.0,0.9,0.3),min(circles,1.0));}
    float grid=smoothstep(0.02,0.0,min(fract(distorted.x*15.0),fract(distorted.y*15.0)));
    col=mix(col,vec3(0.1),grid*0.3);
    fragColor=vec4(col,1.0);}
