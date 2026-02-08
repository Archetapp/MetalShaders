#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float osNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    vec3 water = vec3(0.01, 0.02, 0.04);
    float wave = osNoise(uv*3.0+t*0.2)*0.5+osNoise(uv*7.0-t*0.3)*0.3;
    water += vec3(0.0, 0.01, 0.03)*wave;
    float oilThickness = osNoise(uv*2.0+t*0.1);
    oilThickness += osNoise(uv*5.0-t*0.15)*0.5;
    oilThickness += osNoise(uv*11.0+t*0.05)*0.25;
    float swirl = sin(atan(uv.y-0.5, uv.x-0.5)*3.0 + length(uv-0.5)*10.0 - t*0.5);
    oilThickness += swirl * 0.2;
    float phase = oilThickness * 8.0;
    vec3 rainbow;
    rainbow.r = sin(phase*1.0)*0.5+0.5;
    rainbow.g = sin(phase*1.0+2.094)*0.5+0.5;
    rainbow.b = sin(phase*1.0+4.189)*0.5+0.5;
    rainbow *= rainbow;
    float oilMask = smoothstep(0.3, 0.5, osNoise(uv*1.5+t*0.05));
    vec3 col = mix(water, rainbow*0.7, oilMask*0.8);
    float spec = pow(max(0.0, 1.0-length(uv-vec2(0.5+0.2*sin(t*0.3), 0.5+0.2*cos(t*0.4)))*2.5), 8.0);
    col += vec3(0.3)*spec*oilMask;
    col += water*0.3;
    fragColor = vec4(col, 1.0);
}
