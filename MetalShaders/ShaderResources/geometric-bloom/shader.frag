#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float gbPoly(vec2 p,int n,float r){
    float a=atan(p.y,p.x);
    float seg=6.2832/float(n);
    a=abs(mod(a,seg)-seg*0.5);
    return length(p)-r*cos(seg*0.5)/cos(a);
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.5;
    vec3 col=vec3(0.02,0.02,0.05);
    for(int i=0;i<12;i++){
        float fi=float(i);
        float phase=fi*0.524+t;
        float expand=fract(phase*0.3)*0.6;
        float alpha=1.0-fract(phase*0.3);
        alpha=alpha*alpha;
        int sides=3+int(mod(fi,5.0));
        float rot=t*0.3+fi*0.5;
        float c=cos(rot),s=sin(rot);
        vec2 ruv=mat2(c,-s,s,c)*uv;
        float d=gbPoly(ruv,sides,expand);
        float line=smoothstep(0.015,0.0,abs(d));
        vec3 hue=0.5+0.5*cos(fi*0.7+t+vec3(0,2,4));
        col+=hue*line*alpha*0.8;
        float glow=exp(-abs(d)*40.0)*alpha*0.3;
        col+=hue*glow;
    }
    col=pow(col,vec3(0.9));
    fragColor=vec4(col,1.0);
}
