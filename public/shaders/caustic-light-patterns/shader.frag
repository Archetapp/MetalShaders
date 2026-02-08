#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float clpNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

float clpCaustic(vec2 uv, float t) {
    float c = 0.0;
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float scale = 3.0 + fi * 2.0;
        float speed = 0.3 + fi * 0.15;
        vec2 p = uv * scale + vec2(t * speed, t * speed * 0.7);
        c += sin(clpNoise(p) * 6.28 + t * (1.0 + fi * 0.5)) / scale;
    }
    return c * 0.5 + 0.5;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 causticCenter = hasInput ? mouseCentered : vec2(0.0);
    float c1 = clpCaustic(uv - causticCenter, iMouseTime);
    float c2 = clpCaustic(uv - causticCenter + vec2(0.3, 0.7), iMouseTime * 0.8);
    float c3 = clpCaustic((uv - causticCenter) * 1.5, iMouseTime * 1.2);
    float caustic = c1 * c2 + c3 * 0.3;
    caustic = pow(caustic, 1.5) * 2.0;

    vec3 waterColor = vec3(0.0, 0.15, 0.3);
    vec3 lightColor = vec3(0.3, 0.7, 0.9);
    vec3 brightLight = vec3(0.8, 0.95, 1.0);

    vec3 col = waterColor;
    col += lightColor * caustic * 0.4;
    col += brightLight * pow(caustic, 3.0) * 0.3;

    float depth = smoothstep(-0.5, 0.5, uv.y);
    col *= 0.6 + 0.4 * depth;

    float shimmer = sin(uv.x * 30.0 + iMouseTime * 2.0) * sin(uv.y * 25.0 + iMouseTime * 1.5) * 0.03;
    col += shimmer * lightColor;

    fragColor = vec4(col, 1.0);
}
