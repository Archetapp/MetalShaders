#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 sunsetScatter(float cosTheta, float height) {
    vec3 rayleigh = vec3(0.2, 0.5, 1.0);
    float scatter = pow(1.0 - cosTheta, 3.0);
    vec3 col = mix(rayleigh, vec3(1.0, 0.3, 0.05), scatter);
    col = mix(col, vec3(0.6, 0.2, 0.5), height * 0.8);
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.1;
    
    float sunY = 0.25 + sin(t) * 0.1;
    float sunX = 0.5 + cos(t * 0.3) * 0.1;
    vec2 sunPos = vec2(sunX, sunY);
    
    float height = uv.y;
    float cosTheta = 1.0 - height;
    
    vec3 sky = sunsetScatter(cosTheta, height);
    
    float sunDist = length(uv - sunPos);
    float sun = smoothstep(0.06, 0.03, sunDist);
    float sunGlow = exp(-sunDist * 5.0) * 0.8;
    float sunHalo = exp(-sunDist * 2.0) * 0.3;
    
    vec3 col = sky * (0.6 + 0.4 * (1.0 - height));
    col += vec3(1.0, 0.9, 0.7) * sun;
    col += vec3(1.0, 0.5, 0.2) * sunGlow;
    col += vec3(0.8, 0.3, 0.4) * sunHalo;
    
    float clouds = sin(uv.x * 10.0 + t * 2.0) * sin(uv.x * 7.0 - t) * 0.5 + 0.5;
    clouds *= smoothstep(0.3, 0.6, uv.y) * smoothstep(0.8, 0.5, uv.y);
    col += clouds * vec3(1.0, 0.6, 0.4) * 0.15;
    
    col = pow(col, vec3(0.9));
    fragColor = vec4(col, 1.0);
}
