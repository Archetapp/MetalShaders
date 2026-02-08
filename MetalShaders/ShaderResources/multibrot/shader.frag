#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 multibrotPow(vec2 z, float n) {
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rn = pow(r, n);
    return vec2(rn * cos(n * theta), rn * sin(n * theta));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float section = mod(iTime * 0.15, 3.0);
    float power;
    if (section < 1.0) power = mix(3.0, 4.0, section);
    else if (section < 2.0) power = mix(4.0, 5.0, section - 1.0);
    else power = mix(5.0, 3.0, section - 2.0);
    
    float zoom = 1.3;
    vec2 c = uv * zoom;
    vec2 z = vec2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 150.0; i++) {
        z = multibrotPow(z, power) + c;
        if (dot(z, z) > 256.0) { iter = i; break; }
        iter = i;
    }
    
    vec3 col;
    if (iter >= 149.0) {
        col = vec3(0.01, 0.01, 0.02);
    } else {
        float sm = iter - log(log(dot(z, z)) / log(256.0)) / log(power);
        float t = sm * 0.02;
        
        col = vec3(
            0.5 + 0.5 * sin(t * 5.0 + 0.0),
            0.5 + 0.5 * sin(t * 5.0 + 2.1),
            0.5 + 0.5 * sin(t * 5.0 + 4.2)
        );
        col *= 0.8 + 0.2 * sin(power * 3.14159);
    }
    
    fragColor = vec4(col, 1.0);
}
