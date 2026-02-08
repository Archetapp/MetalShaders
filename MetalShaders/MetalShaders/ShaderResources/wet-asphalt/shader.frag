#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float waNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float grain = waNoise(uv*100.0)*0.1+waNoise(uv*200.0)*0.05;
    vec3 asphalt = vec3(0.06, 0.06, 0.07) + grain;
    float puddle = waNoise(uv*3.0)*0.5+waNoise(uv*7.0)*0.3;
    puddle = smoothstep(0.45, 0.55, puddle);
    float ripple = 0.0;
    for(int i=0;i<8;i++){
        float fi=float(i);
        vec2 drop = vec2(waNoise(vec2(fi*7.0,floor(t+fi))), waNoise(vec2(fi*13.0,floor(t+fi)+0.5)));
        float age = fract(t*0.5+fi*0.125);
        float r = age*0.15;
        float ring = abs(length(uv-drop)-r);
        ripple += smoothstep(0.005, 0.0, ring)*(1.0-age)*puddle;
    }
    vec3 col = asphalt;
    col = mix(col, col*1.3+vec3(0.02), puddle);
    col += vec3(0.2)*ripple;
    vec2 lp = vec2(0.5, 0.8);
    float spec = pow(max(0.0, 1.0-length(uv-lp)*2.0), 12.0)*puddle;
    col += vec3(1.0, 0.9, 0.7)*spec*0.4;
    float scatter = waNoise(uv*50.0+t)*puddle;
    col += vec3(0.1)*pow(scatter, 3.0);
    fragColor = vec4(col, 1.0);
}
