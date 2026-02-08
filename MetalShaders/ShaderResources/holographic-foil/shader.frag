#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 holoRainbow(float phase) {
    return vec3(
        sin(phase) * 0.5 + 0.5,
        sin(phase + 2.094) * 0.5 + 0.5,
        sin(phase + 4.189) * 0.5 + 0.5
    );
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.5;
    
    vec2 tilt = vec2(sin(t * 0.7), cos(t * 0.5)) * 0.3;
    float viewAngle = dot(uv - 0.5, tilt);
    
    float grating = uv.x * 80.0 + uv.y * 40.0;
    float diffraction = sin(grating) * 0.5 + 0.5;
    
    float phase = viewAngle * 20.0 + diffraction * 6.28318 + grating * 0.1;
    vec3 rainbow = holoRainbow(phase);
    
    float microPattern = sin(uv.x * 200.0) * sin(uv.y * 200.0) * 0.1 + 0.9;
    
    float sparkle = pow(abs(sin(grating * 0.5 + t * 3.0)), 20.0) * 0.5;
    
    vec3 col = rainbow * 0.8 * microPattern;
    col += sparkle * vec3(1.0);
    col *= 0.7 + 0.3 * diffraction;
    
    float fresnel = pow(1.0 - abs(dot(normalize(vec3(uv - 0.5, 1.0)), vec3(0,0,1))), 2.0);
    col += fresnel * vec3(0.5, 0.5, 0.6) * 0.3;
    
    fragColor = vec4(col, 1.0);
}
