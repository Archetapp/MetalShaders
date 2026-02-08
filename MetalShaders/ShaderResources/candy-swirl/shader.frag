#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;
    
    float angle = atan(uv.y, uv.x);
    float dist = length(uv);
    
    float swirl = angle + dist * 8.0 - t * 2.0;
    swirl += sin(dist * 10.0 - t * 3.0) * 0.5;
    
    float pattern = sin(swirl * 3.0) * 0.5 + 0.5;
    pattern = smoothstep(0.3, 0.7, pattern);
    
    vec3 pink = vec3(1.0, 0.3, 0.5);
    vec3 blue = vec3(0.3, 0.5, 1.0);
    vec3 white = vec3(1.0, 0.95, 0.98);
    
    vec3 col = mix(pink, blue, pattern);
    float whiteStripe = pow(abs(sin(swirl * 6.0)), 12.0);
    col = mix(col, white, whiteStripe * 0.5);
    
    col *= 0.8 + 0.2 * (1.0 - dist);
    col += pow(max(0.0, 1.0 - dist * 2.0), 3.0) * vec3(0.2);
    
    fragColor = vec4(col, 1.0);
}
