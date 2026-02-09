#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.15;
    vec3 col=vec3(0.95,0.93,0.88);
    float acc=0.0;
    for(int i=0;i<8;i++){
        float fi=float(i);
        float a=fi*0.785398+t;
        float R=0.3+0.05*fi;
        float r=0.08+0.02*sin(t+fi);
        float d=0.1+0.03*cos(t*0.7+fi*0.5);
        for(float s=0.0;s<62.83;s+=0.05){
            float x=(R-r)*cos(s)+d*cos((R-r)/r*s+a);
            float y=(R-r)*sin(s)+d*sin((R-r)/r*s+a);
            float dist=length(uv-vec2(x,y));
            acc+=0.00003/(dist*dist+0.00001);
        }
    }
    acc=clamp(acc,0.0,1.0);
    vec3 inkColor=vec3(0.1,0.35,0.2);
    col=mix(col,inkColor,acc*0.8);
    col*=0.95+0.05*sin(uv.x*200.0)*sin(uv.y*200.0);
    fragColor=vec4(col,1.0);
}
