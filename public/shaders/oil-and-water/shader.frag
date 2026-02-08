#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float oawNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
    float a = fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);
    float b = fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
    float c = fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);
    float d = fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float oawFbm(vec2 p) {
    float v=0.0,a=0.5;
    mat2 r=mat2(0.8,0.6,-0.6,0.8);
    for(int i=0;i<5;i++){v+=a*oawNoise(p);p=r*p*2.0;a*=0.5;}return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);

    float boundary = oawFbm(uv*3.0 + iTime*0.15);
    boundary += oawFbm(uv*6.0 - iTime*0.1)*0.3;
    boundary += sin(uv.x*5.0+iTime*0.3)*0.1 + sin(uv.y*4.0-iTime*0.2)*0.1;
    if (hasInput) {
        float distToMouse = length(uv - mouseCentered);
        boundary += exp(-distToMouse * distToMouse * 8.0) * 0.4;
    }

    float oilMask = smoothstep(0.48, 0.52, boundary);
    vec3 waterColor = vec3(0.1, 0.3, 0.5);
    waterColor += oawFbm(uv*10.0+iTime*0.05)*0.1*vec3(0.0,0.1,0.2);
    float caustic = sin(uv.x*20.0+iTime)*sin(uv.y*15.0+iTime*0.7)*0.05;
    waterColor += caustic*vec3(0.1,0.2,0.3);

    vec3 oilColor = vec3(0.15, 0.12, 0.05);
    float thinFilm = dot(uv, vec2(sin(iTime*0.2), cos(iTime*0.3)))*5.0 + oawFbm(uv*8.0)*3.0;
    vec3 rainbow = 0.5+0.5*cos(6.28*(thinFilm+vec3(0.0,0.33,0.67)));
    oilColor = mix(oilColor, rainbow*0.4, 0.5);

    float edgeGlow = abs(boundary-0.5);
    edgeGlow = smoothstep(0.05, 0.0, edgeGlow);

    vec3 col = mix(waterColor, oilColor, oilMask);
    col += edgeGlow * rainbow * 0.3;

    fragColor = vec4(col, 1.0);
}
