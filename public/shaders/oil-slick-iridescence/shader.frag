#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float osiNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);
float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);
float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 1.0 : sin(iTime*0.4)*0.5;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.6 : cos(iTime*0.6)*0.3;
    float thickness = osiNoise(uv*3.0+iTime*0.05)*0.5+osiNoise(uv*7.0-iTime*0.03)*0.3+0.3;
    float viewAngle = 1.0 - length(uv)*0.5 + tiltX*uv.x + tiltY*uv.y;
    float phase = thickness * viewAngle * 15.0;
    vec3 thinFilm;
    thinFilm.r = pow(sin(phase*1.0)*0.5+0.5, 2.0);
    thinFilm.g = pow(sin(phase*1.2+2.094)*0.5+0.5, 2.0);
    thinFilm.b = pow(sin(phase*1.4+4.189)*0.5+0.5, 2.0);
    vec3 waterBase = vec3(0.05, 0.08, 0.12);
    float waterRipple = sin(uv.x*15.0+iTime*0.5)*sin(uv.y*12.0+iTime*0.3)*0.02;
    waterBase += waterRipple;
    float oilShape = osiNoise(uv*2.0+iTime*0.02);
    oilShape += osiNoise(uv*4.0-iTime*0.03)*0.5;
    float oilMask = smoothstep(0.3, 0.6, oilShape);
    vec3 col = mix(waterBase, thinFilm*0.7+waterBase*0.3, oilMask);
    float edgeHighlight = smoothstep(0.05, 0.0, abs(oilShape-0.45));
    col += edgeHighlight * thinFilm * 0.3;
    float spec = pow(max(0.0, dot(normalize(vec3(uv, 1.0)), normalize(vec3(tiltX, tiltY, 1.0)))), 16.0);
    col += spec * 0.15 * oilMask;
    fragColor = vec4(col, 1.0);
}
