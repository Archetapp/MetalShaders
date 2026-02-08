#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cpWave(vec2 p,vec2 center,float t,float freq,float speed){
    float d=length(p-center);
    return sin(d*freq-t*speed)*exp(-d*2.0)*0.5;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    float h=0.0;
    h+=cpWave(uv,vec2(0.2,0.1),t,25.0,4.0);
    h+=cpWave(uv,vec2(-0.3,-0.15),t*0.8,20.0,3.0);
    h+=cpWave(uv,vec2(0.0,0.3),t*1.2,30.0,5.0);
    h+=cpWave(uv,vec2(-0.15,0.0),t*0.6,22.0,3.5)*0.7;
    vec2 dx=vec2(0.001,0.0);
    vec2 dy=vec2(0.0,0.001);
    float hx=cpWave(uv+dx,vec2(0.2,0.1),t,25.0,4.0)+cpWave(uv+dx,vec2(-0.3,-0.15),t*0.8,20.0,3.0)+cpWave(uv+dx,vec2(0.0,0.3),t*1.2,30.0,5.0);
    float hy=cpWave(uv+dy,vec2(0.2,0.1),t,25.0,4.0)+cpWave(uv+dy,vec2(-0.3,-0.15),t*0.8,20.0,3.0)+cpWave(uv+dy,vec2(0.0,0.3),t*1.2,30.0,5.0);
    vec3 normal=normalize(vec3((h-hx)/0.001,(h-hy)/0.001,1.0));
    vec3 skyColor=mix(vec3(0.4,0.6,0.9),vec3(0.7,0.85,1.0),uv.y+0.5);
    vec3 reflected=reflect(vec3(0,0,-1),normal);
    float fresnel=pow(1.0-abs(dot(vec3(0,0,1),normal)),3.0);
    vec3 waterColor=vec3(0.05,0.2,0.35);
    vec3 col=mix(waterColor,skyColor,fresnel*0.6+0.2);
    float spec=pow(max(dot(reflected,normalize(vec3(0.3,0.5,1.0))),0.0),64.0);
    col+=vec3(1.0,0.95,0.9)*spec*0.6;
    col+=h*0.1;
    fragColor=vec4(col,1.0);
}
