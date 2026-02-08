#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float curlHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float curlNoiseFn(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(curlHash(i), curlHash(i+vec2(1,0)), f.x),
               mix(curlHash(i+vec2(0,1)), curlHash(i+vec2(1,1)), f.x), f.y);
}

float curlFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * curlNoiseFn(p); p *= 2.0; a *= 0.5; }
    return v;
}

vec2 curlField(vec2 p) {
    float eps = 0.01;
    float dx = curlFbm(p + vec2(eps, 0.0)) - curlFbm(p - vec2(eps, 0.0));
    float dy = curlFbm(p + vec2(0.0, eps)) - curlFbm(p - vec2(0.0, eps));
    return vec2(dy, -dx) / (2.0 * eps);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.2;
    
    vec2 p = uv * 4.0;
    vec2 curl = curlField(p + t);
    
    float streamline = sin(dot(curl, uv * 20.0) + t * 5.0) * 0.5 + 0.5;
    float flow = length(curl);
    
    vec3 col1 = vec3(0.05, 0.1, 0.2);
    vec3 col2 = vec3(0.2, 0.4, 0.7);
    vec3 col3 = vec3(0.8, 0.6, 0.3);
    
    vec3 col = mix(col1, col2, streamline);
    col = mix(col, col3, flow * 0.5);
    col += pow(streamline, 4.0) * vec3(0.3, 0.5, 0.7) * 0.3;
    
    fragColor = vec4(col, 1.0);
}
