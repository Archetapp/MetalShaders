#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float vvNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    vec3 baseColor = vec3(0.4, 0.05, 0.1);
    vec2 lightDir = normalize(vec2(sin(t*0.5), cos(t*0.3)));
    vec2 surfaceNormal = vec2(0.0);
    float nScale = 50.0;
    surfaceNormal.x = vvNoise(uv*nScale+vec2(0.1,0.0)) - vvNoise(uv*nScale-vec2(0.1,0.0));
    surfaceNormal.y = vvNoise(uv*nScale+vec2(0.0,0.1)) - vvNoise(uv*nScale-vec2(0.0,0.1));
    float nDotL = dot(normalize(surfaceNormal+vec2(0.0,0.0001)), lightDir);
    float rimLight = pow(1.0 - abs(nDotL), 3.0);
    float fuzz = vvNoise(uv*200.0)*0.15;
    float microFuzz = vvNoise(uv*500.0+t*0.1)*0.08;
    vec3 col = baseColor * (0.4 + 0.3*max(nDotL, 0.0));
    col += baseColor * 2.0 * rimLight;
    col += vec3(0.8, 0.3, 0.4) * rimLight * 0.5;
    col += fuzz * baseColor;
    col += microFuzz * vec3(0.3, 0.1, 0.15);
    float fold1 = sin(uv.x*8.0+sin(uv.y*3.0)*2.0+t*0.2)*0.5+0.5;
    float fold2 = sin(uv.y*6.0+sin(uv.x*4.0)*1.5)*0.5+0.5;
    col *= 0.85 + fold1*0.1 + fold2*0.05;
    float sheen = pow(max(0.0, dot(lightDir, normalize(vec2(fold1-0.5, fold2-0.5)+0.001))), 4.0);
    col += vec3(0.6, 0.2, 0.3)*sheen*0.2;
    fragColor = vec4(col, 1.0);
}
