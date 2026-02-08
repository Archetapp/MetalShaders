#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float sfNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float r = length(uv);
    float membrane = smoothstep(0.45, 0.44, r);
    float thickness = 0.5 + 0.3*sfNoise(uv*3.0 + t*0.3);
    thickness += 0.2*sfNoise(uv*7.0 - t*0.5);
    thickness += r*0.5;
    float gravity = uv.y*0.3 + sin(t*0.2)*0.1;
    thickness += gravity;
    float swirl = atan(uv.y, uv.x) + t*0.2;
    thickness += sin(swirl*3.0)*0.1;
    float phase = thickness * 12.0;
    vec3 thinFilm;
    thinFilm.r = sin(phase)*0.5+0.5;
    thinFilm.g = sin(phase + 2.094)*0.5+0.5;
    thinFilm.b = sin(phase + 4.189)*0.5+0.5;
    thinFilm = pow(thinFilm, vec3(0.8));
    float fresnel = pow(1.0 - abs(dot(normalize(vec3(uv, 0.3)), vec3(0,0,1))), 2.0);
    vec3 col = thinFilm * (0.6 + fresnel*0.4);
    col *= membrane;
    float rim = smoothstep(0.44, 0.42, r) - smoothstep(0.42, 0.38, r);
    col += vec3(0.8)*rim*0.3;
    float spec = pow(max(0.0, 1.0-length(uv-vec2(-0.1, 0.15))*3.0), 5.0);
    col += vec3(1.0)*spec*0.3*membrane;
    col += vec3(0.02, 0.02, 0.05)*(1.0-membrane);
    fragColor = vec4(col, 1.0);
}
