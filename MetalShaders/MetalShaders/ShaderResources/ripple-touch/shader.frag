#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.15,0.15,0.2);
    float buttonW=0.3,buttonH=0.08;
    vec2 bd=abs(uv)-vec2(buttonW,buttonH);
    float button=smoothstep(0.01,0.0,max(bd.x,bd.y)-0.02);
    col=mix(col,vec3(0.2,0.4,0.8),button);
    float rippleInterval=2.0;
    for(int i=0;i<3;i++){float fi=float(i);
        float rippleStart=fi*rippleInterval;
        float rippleAge=mod(t-rippleStart,rippleInterval*3.0);
        if(rippleAge<1.5){
            vec2 origin=vec2(sin(fi*2.0)*0.1,sin(fi*3.0)*0.03);
            float rippleR=rippleAge*0.4;
            float d=length(uv-origin);
            float ripple=smoothstep(rippleR,rippleR-0.02,d);
            float fade=1.0-rippleAge/1.5;
            ripple*=fade*button;
            col+=vec3(0.3,0.5,1.0)*ripple*0.4;}}
    float highlight=button*smoothstep(0.0,-0.05,uv.y-buttonH)*0.1;
    col+=highlight;
    fragColor=vec4(col,1.0);}
