#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cgNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float n1 = cgNoise(uv*4.0+t*0.05);
    float n2 = cgNoise(uv*8.0-t*0.03);
    float n3 = cgNoise(uv*2.0+vec2(t*0.02, -t*0.01));
    float pool = n1*0.5+n2*0.3+n3*0.2;
    pool = smoothstep(0.3, 0.7, pool);
    vec3 glaze1 = vec3(0.15, 0.35, 0.5);
    vec3 glaze2 = vec3(0.6, 0.3, 0.15);
    vec3 glaze3 = vec3(0.2, 0.5, 0.3);
    vec3 col = mix(glaze1, glaze2, pool);
    float pool2 = cgNoise(uv*6.0+vec2(n1, n2)*2.0);
    col = mix(col, glaze3, smoothstep(0.4, 0.6, pool2)*0.4);
    vec2 lightPos = vec2(0.5+0.2*sin(t*0.4), 0.5+0.2*cos(t*0.3));
    float ld = length(uv - lightPos);
    float spec = exp(-ld*ld*15.0);
    float glossy = pow(spec, 3.0);
    col += vec3(1.0, 0.95, 0.9)*glossy*0.6;
    col *= 0.8 + spec*0.3;
    float craze = cgNoise(uv*50.0);
    craze = smoothstep(0.48, 0.5, craze)*0.1;
    col -= craze;
    col = pow(col, vec3(0.9));
    fragColor = vec4(col, 1.0);
}
