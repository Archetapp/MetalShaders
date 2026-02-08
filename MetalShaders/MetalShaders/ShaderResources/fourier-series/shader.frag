#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.06);
    int terms=int(mod(t*0.5,12.0))+1;
    float squareApprox=0.0;float triApprox=0.0;
    for(int n=0;n<12;n++){if(n>=terms)break;
        float fn=float(n);float k=2.0*fn+1.0;
        squareApprox+=sin(uv.x*k*8.0+t)/(k)*0.3;
        float sign=mod(fn,2.0)==0.0?1.0:-1.0;
        triApprox+=sign*sin(uv.x*k*8.0+t)/(k*k)*0.4;}
    float sd=abs(uv.y-0.15-squareApprox);
    col+=vec3(0.2,0.6,1.0)*smoothstep(0.005,0.0,sd);
    col+=vec3(0.2,0.6,1.0)*0.002/(sd+0.002)*0.2;
    float td=abs(uv.y+0.15-triApprox);
    col+=vec3(1.0,0.4,0.2)*smoothstep(0.005,0.0,td);
    col+=vec3(1.0,0.4,0.2)*0.002/(td+0.002)*0.2;
    col+=vec3(0.1)*(smoothstep(0.002,0.0,abs(uv.y-0.15))+smoothstep(0.002,0.0,abs(uv.y+0.15)));
    fragColor=vec4(col,1.0);}
