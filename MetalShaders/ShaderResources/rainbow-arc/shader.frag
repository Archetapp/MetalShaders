#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 raSpectrum(float t){
    vec3 c;
    if(t<0.17) c=mix(vec3(0.5,0.0,0.5),vec3(0.0,0.0,1.0),t/0.17);
    else if(t<0.33) c=mix(vec3(0.0,0.0,1.0),vec3(0.0,0.8,1.0),(t-0.17)/0.16);
    else if(t<0.5) c=mix(vec3(0.0,0.8,1.0),vec3(0.0,0.9,0.0),(t-0.33)/0.17);
    else if(t<0.67) c=mix(vec3(0.0,0.9,0.0),vec3(1.0,1.0,0.0),(t-0.5)/0.17);
    else if(t<0.83) c=mix(vec3(1.0,1.0,0.0),vec3(1.0,0.5,0.0),(t-0.67)/0.16);
    else c=mix(vec3(1.0,0.5,0.0),vec3(1.0,0.0,0.0),(t-0.83)/0.17);
    return c;
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.1;
    vec3 sky=mix(vec3(0.4,0.6,0.9),vec3(0.7,0.85,1.0),uv.y);
    vec3 col=sky;
    vec2 center=vec2(0.5,-0.2);
    float r=length(uv-center);
    float bowR=0.75;
    float bowW=0.06;
    float bowDist=(r-bowR)/bowW;
    if(abs(bowDist)<1.0&&uv.y>center.y){
        float spectralPos=bowDist*0.5+0.5;
        vec3 rainbow=raSpectrum(spectralPos);
        float fade=smoothstep(1.0,0.8,abs(bowDist));
        float angleFade=smoothstep(-0.1,0.2,(uv.y-center.y)/r);
        col=mix(col,rainbow,fade*angleFade*0.6*(0.8+0.2*sin(t*3.0)));
    }
    float bow2R=0.9;
    float bow2W=0.04;
    float bow2Dist=(r-bow2R)/bow2W;
    if(abs(bow2Dist)<1.0&&uv.y>center.y){
        float spectralPos=1.0-(bow2Dist*0.5+0.5);
        vec3 rainbow=raSpectrum(spectralPos);
        float fade=smoothstep(1.0,0.8,abs(bow2Dist));
        float angleFade=smoothstep(-0.1,0.2,(uv.y-center.y)/r);
        col=mix(col,rainbow,fade*angleFade*0.25);
    }
    float darkBand=smoothstep(bowR+bowW,bowR+bowW+0.02,r)*smoothstep(bow2R-bow2W,bow2R-bow2W-0.02,r);
    if(uv.y>center.y) col*=1.0-darkBand*0.1;
    fragColor=vec4(col,1.0);
}
