// import Phaser from "phaser";
// import { globalTime } from "../TimeManager";

// export default class DayNightPipeline extends Phaser.Scene {
//     constructor(game: Phaser.Game) {
//         super({
//             game,
//             renderTarget: true,
//             name: "DayNight",
//             fragShader: `
//             precision mediump float;

//             uniform float uTime;
//             uniform sampler2D uMainSampler;
//             varying vec2 outTexCoord;

//             // Noise function for fog effect
//             float rand(vec2 co) {
//                 return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
//             }

//             void main() {
//                 vec4 color = texture2D(uMainSampler, outTexCoord);

//                 // Time-based values
//                 float time = uTime * 0.5;
//                 float dayTime = abs(sin(time * 0.5));

//                 // Fog calculation
//                 float fogNoise = rand(outTexCoord + vec2(time * 0.1));
//                 float fogStrength = 0.15 * (sin(time * 0.2) * 0.5 + 0.5);
//                 vec2 fogOffset = vec2(
//                     sin(time * 0.1 + outTexCoord.y * 4.0) * 0.02,
//                     cos(time * 0.15 + outTexCoord.x * 4.0) * 0.02
//                 );
//                 vec2 fogUV = outTexCoord + fogOffset;
//                 float fog = smoothstep(0.0, 1.0, fogNoise) * fogStrength;

//                 // Day/night cycle colors
//                 vec3 dayColor = vec3(1.0, 0.95, 0.8);    // Warm sunlight
//                 vec3 nightColor = vec3(0.2, 0.3, 0.5);   // Dark blue night
//                 vec3 fogColor = vec3(0.6, 0.7, 0.8);     // Bluish fog

//                 // Vignette effect
//                 vec2 center = outTexCoord - 0.5;
//                 float vignette = 1.0 - dot(center, center) * 0.7;

//                 // Combine effects
//                 vec3 baseColor = mix(dayColor, nightColor, dayTime);
//                 vec3 finalColor = color.rgb * baseColor;

//                 // Add fog
//                 finalColor = mix(finalColor, fogColor, fog * (0.3 + 0.2 * dayTime));

//                 // Apply vignette
//                 finalColor *= vignette;

//                 // Add subtle pulsing glow at night
//                 float pulse = sin(time * 2.0) * 0.5 + 0.5;
//                 float nightGlow = dayTime * pulse * 0.1;
//                 finalColor += nightGlow * nightColor;

//                 // Output final color
//                 gl_FragColor = vec4(finalColor, color.a);
//             }
//             `,
//         });
//     }

//     onPreRender() {
//         // Use global time instead of internal time
//         this.set1f("uTime", globalTime.normalizedTime);
//     }
// }
