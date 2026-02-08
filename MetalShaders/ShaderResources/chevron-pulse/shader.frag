#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.05,0.05,0.12);
    float scale=12.0;
    float y=uv.y*scale+t*2.0;
    float row=floor(y);
    float fy=fract(y);
    float chevron=abs(uv.x)*3.0-fy*0.5;
    float pulse=sin(row*0.5-t*3.0)*0.5+0.5;
    float shape=smoothstep(0.02,0.0,abs(chevron-0.3)-0.08);
    shape+=smoothstep(0.02,0.0,abs(chevron-0.15)-0.06)*0.5;
    vec3 chevCol=mix(vec3(0.1,0.5,0.9),vec3(0.0,0.9,0.6),pulse);
    chevCol*=(0.5+0.5*pulse);
    col+=chevCol*shape;
    float glow=shape*pulse*0.3;
    col+=chevCol*glow;
    fragColor=vec4(col,1.0);
}
