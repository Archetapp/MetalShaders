#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float curlPos=fract(t*0.15);
    float curlX=curlPos*1.4-0.2;
    float curlRadius=0.08+0.05*sin(t*0.5);
    vec3 pageTop=vec3(0.95,0.93,0.88);vec3 pageBottom=vec3(0.2,0.4,0.8);
    float distToCurl=uv.x-curlX;
    vec3 col;
    if(distToCurl>curlRadius){
        col=pageTop;col+=sin(uv.x*30.0)*sin(uv.y*30.0)*0.05;
    }else if(distToCurl>0.0){
        float angle=distToCurl/curlRadius*3.14159;
        float shadow=1.0-distToCurl/curlRadius*0.5;
        col=mix(pageTop*shadow,pageBottom,sin(angle)*0.5+0.5);
        col+=pow(sin(angle),8.0)*0.3;
    }else{
        col=pageBottom;col+=mod(floor(uv.x*10.0)+floor(uv.y*10.0),2.0)*0.1;
        col-=exp(-abs(distToCurl)*15.0)*0.3;
    }
    fragColor=vec4(col,1.0);}
