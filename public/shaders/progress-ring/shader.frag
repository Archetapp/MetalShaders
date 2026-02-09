#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.12,0.12,0.15);
    float r=length(uv);float angle=atan(uv.y,uv.x);
    float progress=fract(t*0.15);
    float progressAngle=-3.14159+progress*6.28318;
    float trackWidth=0.025;float radius=0.2;
    float track=smoothstep(trackWidth,trackWidth-0.003,abs(r-radius));
    col+=vec3(0.15,0.15,0.18)*track;
    float normAngle=mod(angle+3.14159,6.28318)-3.14159;
    float fill=smoothstep(progressAngle+0.05,progressAngle-0.05,normAngle)*smoothstep(-3.14159-0.05,-3.14159+0.05,normAngle);
    fill*=track;
    vec3 fillCol=mix(vec3(0.2,0.6,0.9),vec3(0.1,0.9,0.5),progress);
    col=mix(col,fillCol,fill);
    float glow=fill*0.003/(abs(r-radius)+0.003);
    col+=fillCol*glow*0.3;
    float endAngle=progressAngle;
    vec2 endPos=vec2(cos(endAngle),sin(endAngle))*radius;
    float endDot=smoothstep(0.03,0.02,length(uv-endPos));
    col=mix(col,fillCol*1.3,endDot*fill);
    float textY=smoothstep(0.03,0.0,abs(uv.y));
    float textX=smoothstep(0.05,0.0,abs(uv.x));
    col+=vec3(0.5)*textX*textY*0.2;
    fragColor=vec4(col,1.0);}
