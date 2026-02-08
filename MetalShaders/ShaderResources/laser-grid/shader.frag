#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float lgNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec3 col = vec3(0.02, 0.02, 0.03);

    float fog = lgNoise(uv * 3.0 + iTime * 0.1) * 0.05;
    col += fog * vec3(0.1, 0.15, 0.2);

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float scanPos = sin(iTime * (0.5 + fi * 0.2) + fi * 1.5) * 0.4;
        float beamH = smoothstep(0.004, 0.0, abs(uv.y - scanPos));
        float beamGlowH = exp(-abs(uv.y - scanPos) * 30.0);
        vec3 beamColor = fi < 2.0 ? vec3(1.0, 0.1, 0.1) : vec3(0.1, 1.0, 0.2);
        col += beamColor * beamH * 0.8;
        col += beamColor * beamGlowH * 0.15;
        float fogScatter = lgNoise(vec2(uv.x * 10.0, scanPos * 20.0 + iTime)) * beamGlowH;
        col += beamColor * fogScatter * 0.1;
    }

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float scanPos = cos(iTime * (0.4 + fi * 0.15) + fi * 2.0) * 0.4;
        float beamV = smoothstep(0.004, 0.0, abs(uv.x - scanPos));
        float beamGlowV = exp(-abs(uv.x - scanPos) * 30.0);
        vec3 beamColor = fi < 2.0 ? vec3(0.1, 0.3, 1.0) : vec3(0.8, 0.1, 0.8);
        col += beamColor * beamV * 0.8;
        col += beamColor * beamGlowV * 0.15;
    }

    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++) {
            float hi = sin(iTime * (0.5 + float(i) * 0.2) + float(i) * 1.5) * 0.4;
            float vj = cos(iTime * (0.4 + float(j) * 0.15) + float(j) * 2.0) * 0.4;
            vec2 intersection = vec2(vj, hi);
            float intDist = length(uv - intersection);
            float intGlow = exp(-intDist * 20.0) * 0.3;
            col += intGlow * vec3(1.0, 0.8, 0.9);
        }
    }

    fragColor = vec4(col, 1.0);
}
