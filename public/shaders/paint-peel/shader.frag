#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float ppNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

    float peelProgress = clamp(iMouseTime * 0.3, 0.0, 1.0);
    float peelLine = hasInput ? (centered.x + centered.y * 0.3 - (mouseCentered.x + mouseCentered.y * 0.3)) : (centered.x + centered.y * 0.3 - (peelProgress * 2.5 - 1.0));
    float noiseEdge = ppNoise(centered * 5.0) * 0.15;
    peelLine += noiseEdge;

    float peeled = smoothstep(0.0, 0.05, peelLine);

    vec3 underSurface = vec3(0.6, 0.55, 0.45);
    underSurface += ppNoise(centered * 10.0) * 0.1;

    vec3 paintColor = vec3(0.3, 0.5, 0.7);
    paintColor += ppNoise(centered * 8.0 + 100.0) * 0.05;

    float curlWidth = 0.15;
    float curlZone = smoothstep(curlWidth, 0.0, peelLine) * smoothstep(-0.02, 0.0, peelLine);
    float curlAngle = (1.0 - peelLine / curlWidth) * 3.14159 * 1.5;
    float curlHeight = sin(curlAngle) * 0.5 + 0.5;
    float curlShade = cos(curlAngle) * 0.5 + 0.5;

    vec3 curlColor = mix(paintColor * curlShade, underSurface * (1.0 - curlShade), step(3.14159 * 0.5, curlAngle));

    float shadow = smoothstep(curlWidth * 1.5, 0.0, peelLine) * 0.3 * (1.0 - peeled);

    vec3 col = underSurface * (1.0 - peeled);
    col = mix(col, paintColor, peeled);
    col = mix(col, curlColor, curlZone);
    col *= 1.0 - shadow;

    float edgeHighlight = smoothstep(0.01, 0.0, abs(peelLine)) * 0.3;
    col += edgeHighlight * vec3(1.0, 0.95, 0.9);

    fragColor = vec4(col, 1.0);
}
