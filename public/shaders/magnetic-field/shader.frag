#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float sep = 0.2 + 0.05*sin(t*0.5);
    vec2 pole1 = vec2(-sep, 0.0);
    vec2 pole2 = vec2(sep, 0.0);
    vec2 d1 = uv - pole1;
    vec2 d2 = uv - pole2;
    float r1 = length(d1)+0.001;
    float r2 = length(d2)+0.001;
    vec2 B = d1/(r1*r1*r1) - d2/(r2*r2*r2);
    float Bmag = length(B);
    vec2 Bdir = B / (Bmag+0.001);
    float angle = atan(Bdir.y, Bdir.x);
    float lines = sin(angle*8.0 + Bmag*50.0)*0.5+0.5;
    lines = smoothstep(0.3, 0.7, lines);
    float fieldStr = clamp(Bmag*5.0, 0.0, 1.0);
    vec3 col = vec3(0.02, 0.02, 0.05);
    vec3 lineCol = mix(vec3(0.1,0.2,0.5), vec3(0.3,0.6,1.0), fieldStr);
    col += lineCol * lines * fieldStr;
    float glow1 = 0.005/(r1*r1+0.005);
    float glow2 = 0.005/(r2*r2+0.005);
    col += vec3(1.0,0.2,0.2)*glow1;
    col += vec3(0.2,0.2,1.0)*glow2;
    float filings = sin(uv.x*200.0+Bdir.x*50.0)*sin(uv.y*200.0+Bdir.y*50.0);
    filings = smoothstep(0.8, 1.0, filings)*fieldStr*0.3;
    col += vec3(0.5,0.5,0.6)*filings;
    fragColor = vec4(col, 1.0);
}
