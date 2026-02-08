#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.95,0.95,0.97);
    float r=length(uv);float angle=atan(uv.y,uv.x);
    float spinAngle=t*3.0;
    float arcLength=3.14159+sin(t*2.0)*1.0;
    float relAngle=mod(angle-spinAngle+3.14159,6.28318)-3.14159;
    float arc=smoothstep(0.0,0.3,relAngle+arcLength)*smoothstep(arcLength+0.3,arcLength,relAngle+arcLength);
    float ring=smoothstep(0.15,0.14,abs(r-0.2));
    float spinner=arc*ring;
    float gradient=smoothstep(0.0,arcLength,relAngle+arcLength);
    vec3 spinnerCol=mix(vec3(0.2,0.4,0.9),vec3(0.4,0.7,1.0),gradient);
    col=mix(col,spinnerCol,spinner);
    float cap1=smoothstep(0.02,0.01,length(uv-vec2(cos(spinAngle),sin(spinAngle))*0.2));
    float cap2Angle=spinAngle+arcLength;
    float cap2=smoothstep(0.02,0.01,length(uv-vec2(cos(cap2Angle),sin(cap2Angle))*0.2));
    col=mix(col,spinnerCol,(cap1+cap2)*0.5);
    float track=smoothstep(0.005,0.0,abs(r-0.2))*0.1;
    col-=track;
    fragColor=vec4(col,1.0);}
