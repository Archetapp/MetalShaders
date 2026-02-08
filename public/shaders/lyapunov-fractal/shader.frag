#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
    float pan = sin(iTime * 0.1) * 0.3;
    float a = mix(2.0, 4.0, uv.x) + pan;
    float b = mix(2.0, 4.0, uv.y) + pan;
    
    float x = 0.5;
    float lyap = 0.0;
    int seq[12]; 
    seq[0]=0; seq[1]=1; seq[2]=0; seq[3]=1; seq[4]=1; seq[5]=0;
    seq[6]=0; seq[7]=1; seq[8]=0; seq[9]=1; seq[10]=1; seq[11]=0;
    
    for (int n = 0; n < 120; n++) {
        float r = (seq[n - (n/12)*12] == 0) ? a : b;
        x = r * x * (1.0 - x);
        if (n > 20) {
            float deriv = abs(r * (1.0 - 2.0 * x));
            if (deriv > 0.0) lyap += log(deriv);
        }
    }
    lyap /= 100.0;
    
    vec3 col;
    if (lyap < 0.0) {
        float t = clamp(-lyap * 2.0, 0.0, 1.0);
        col = mix(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.5, 1.0), t);
    } else {
        float t = clamp(lyap * 3.0, 0.0, 1.0);
        col = mix(vec3(0.2, 0.0, 0.0), vec3(1.0, 0.8, 0.0), t);
    }
    
    fragColor = vec4(col, 1.0);
}
