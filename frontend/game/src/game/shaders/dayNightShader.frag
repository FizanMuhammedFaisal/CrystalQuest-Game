precision mediump float;

uniform float uTime;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float brightness = 0.5 + 0.5 * sin(uTime);
    gl_FragColor = vec4(color.rgb * brightness, color.a);
}
