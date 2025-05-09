// import { Scene } from "phaser";
// import { ShaderType } from "../shaders/ShaderManager";

// /**
//  * This is a parallel scene that handles rendering shaders over your main game
//  * This approach avoids the WebGL pipeline issues in Phaser 3.88.2
//  */
// export class ShaderScene extends Scene {
//     private shaderImage: Phaser.GameObjects.Image;
//     private currentShader: Phaser.GameObjects.Shader | null = null;
//     private activeShaderType: ShaderType = ShaderType.NONE;
//     private transitionTween: Phaser.Tweens.Tween | null = null;

//     constructor() {
//         super({ key: "shaderScene" });
//     }

//     create() {
//         // Create a fullscreen shader object that will sit above the main scene
//         const width = this.scale.width;
//         const height = this.scale.height;

//         // Create a simple 1x1 white texture if it doesn't exist
//         if (!this.textures.exists("__WHITE")) {
//             const graphics = this.make.graphics({});
//             graphics.fillStyle(0xffffff);
//             graphics.fillRect(0, 0, 1, 1);
//             graphics.generateTexture("__WHITE", 1, 1);
//             graphics.destroy();
//         }

//         // Create base image that will be overlaid with shaders
//         this.shaderImage = this.add
//             .image(width / 2, height / 2, "__WHITE")
//             .setDisplaySize(width, height)
//             .setAlpha(0); // Start with transparent
//         this.shaderImage.setBlendMode(Phaser.BlendModes.NORMAL);
//         // IMPORTANT: Use a blend mode that works with your game's visual style
//         // Try different blend modes if needed:
//         // SCREEN - Brightens the image below
//         // MULTIPLY - Darkens the image below
//         // OVERLAY - Mix of SCREEN and MULTIPLY

//         // Make this scene transparent otherwise
//         this.cameras.main.transparent = true;

//         // Set the scene to be above other scenes
//         this.scene.setVisible(true);

//         // Ensure this scene stays on top and maintains its position
//         this.cameras.main.setScroll(0, 0);
//         this.cameras.main.scrollX = 0;
//         this.cameras.main.scrollY = 0;
//     }

//     public applyShader(shaderType: ShaderType, duration: number = 1000) {
//         console.log("ShaderScene applying shader:", shaderType);

//         // Stop any transition in progress
//         if (this.transitionTween && this.transitionTween.isPlaying()) {
//             this.transitionTween.stop();
//         }

//         // If we're disabling shaders
//         if (shaderType === ShaderType.NONE) {
//             // Fade out the current effect
//             this.transitionTween = this.tweens.add({
//                 targets: this.shaderImage,
//                 alpha: 0,
//                 duration: duration,
//                 onComplete: () => {
//                     if (this.currentShader) {
//                         this.currentShader.destroy();
//                         this.currentShader = null;
//                     }
//                 },
//             });
//             this.activeShaderType = ShaderType.NONE;
//             return;
//         }

//         // Create the appropriate shader based on type
//         const shaderConfig = this.getShaderConfig(shaderType);

//         // Destroy old shader if it exists
//         if (this.currentShader) {
//             this.currentShader.destroy();
//         }

//         // Create new shader with the shader config
//         this.currentShader = this.add.shader(
//             shaderConfig.key,
//             this.scale.width / 2,
//             this.scale.height / 2,
//             this.scale.width,
//             this.scale.height,
//             ["__WHITE"] // Texture key to apply shader to
//         );

//         // Set initial uniforms
//         if (shaderConfig.uniforms) {
//             for (const [key, value] of Object.entries(shaderConfig.uniforms)) {
//                 this.currentShader.setUniform(key, value.value);
//             }
//         }

//         // Get appropriate alpha for this shader type
//         let targetAlpha = this.getTargetAlphaForShader(shaderType);

//         // IMPORTANT: Set a more appropriate alpha value - this may be too high
//         targetAlpha = Math.min(targetAlpha, 0.5); // Limit max alpha to 0.5 for testing

//         // Show the shader effect by fading in the image
//         this.transitionTween = this.tweens.add({
//             targets: this.shaderImage,
//             alpha: targetAlpha,
//             duration: duration,
//         });

//         this.activeShaderType = shaderType;
//     }

//     private getTargetAlphaForShader(shaderType: ShaderType): number {
//         // Adjust alpha based on shader type - REDUCE THESE VALUES
//         switch (shaderType) {
//             case ShaderType.FOG:
//                 return 0.4; // Reduced from 0.85
//             case ShaderType.WARM:
//                 return 0.35; // Reduced from 0.7
//             case ShaderType.COLD:
//                 return 0.35; // Reduced from 0.75
//             case ShaderType.UNDERWATER:
//                 return 0.4; // Reduced from 0.9
//             case ShaderType.NIGHT:
//                 return 0.5; // Reduced from 0.95
//             case ShaderType.CAVE:
//                 return 0.4; // Reduced from 0.9
//             default:
//                 return 0.3; // Reduced from 0.8
//         }
//     }

//     private getShaderConfig(shaderType: ShaderType) {
//         // Return appropriate shader definition based on type
//         switch (shaderType) {
//             case ShaderType.FOG:
//                 return {
//                     key: "FogShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform float time;
//                         uniform vec2 resolution;
//                         uniform float uDensity;
//                         uniform vec3 uFogColor;

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;
//                             vec4 color = texture2D(uMainSampler, uv);

//                             // Create fog effect with improved noise
//                             float noiseX = sin(uv.x * 12.0 + time * 0.0005) *
//                                          cos(uv.y * 15.0 + time * 0.0007);
//                             float noiseY = sin(uv.y * 14.0 + time * 0.0006) *
//                                          cos(uv.x * 13.0 + time * 0.0008);
//                             float noise = (noiseX + noiseY) * 0.25;

//                             float distFromCenter = distance(uv, vec2(0.5));
//                             float vignette = smoothstep(0.4, 0.75, distFromCenter);

//                             float fogFactor = smoothstep(0.0, uDensity, noise + vignette * 0.4);

//                             // IMPORTANT: Modified to be more subtle
//                             vec3 finalColor = mix(color.rgb, uFogColor, fogFactor * 0.3);
//                             gl_FragColor = vec4(finalColor, 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uDensity: { type: "1f", value: 0.5 }, // Reduced from 0.7
//                         uFogColor: { type: "3f", value: [0.6, 0.7, 0.8] }, // Light blue-gray fog
//                     },
//                 };
//             case ShaderType.WARM:
//                 return {
//                     key: "WarmShader",
//                     fragmentShader: `
//             precision mediump float;
//             uniform sampler2D uMainSampler;
//             uniform float time;
//             uniform vec2 resolution;
//             uniform float uIntensity;

//             void main() {
//                 vec2 uv = gl_FragCoord.xy / resolution;

//                 // Heat distortion effect - REDUCED EFFECT
//                 float distortionStrength = 0.001 * uIntensity;
//                 float speedFactor = 0.0008;

//                 float distortionX = sin(uv.y * 20.0 + time * speedFactor) * distortionStrength;
//                 float distortionY = cos(uv.x * 20.0 + time * speedFactor * 0.8) * distortionStrength * 0.5;

//                 vec2 distCoord = vec2(
//                     uv.x + distortionX,
//                     uv.y + distortionY
//                 );

//                 vec4 color = texture2D(uMainSampler, distCoord); // Sampling __WHITE

//                 // Create warm tint
//                 color.r = min(1.0, color.r * (1.0 + uIntensity * 0.15));
//                 color.g = min(1.0, color.g * (1.0 + uIntensity * 0.05));
//                 color.b = max(0.0, color.b * (1.0 - uIntensity * 0.1));

//                 // Add subtle glow for hot areas
//                 float glow = sin(time * 0.001) * 0.03 + 0.02;
//                 vec3 warmGlow = vec3(1.0, 0.6, 0.3) * glow * uIntensity;

//                 gl_FragColor = vec4(color.rgb + warmGlow, 1.0);
//             }
//         `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uIntensity: { type: "1f", value: 0.4 },
//                     },
//                 };
//             case ShaderType.COLD:
//                 return {
//                     key: "ColdShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform float time;
//                         uniform vec2 resolution;
//                         uniform float uIntensity;

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;
//                             vec4 color = texture2D(uMainSampler, uv);

//                             // Create cold effect - REDUCED EFFECT
//                             color.r = max(0.0, color.r * (1.0 - uIntensity * 0.15));  // Reduced from 0.3
//                             color.g = max(0.0, color.g * (1.0 - uIntensity * 0.05));  // Reduced from 0.1
//                             color.b = min(1.0, color.b * (1.0 + uIntensity * 0.15));  // Reduced from 0.3

//                             // Add frost effect around edges - REDUCED EFFECT
//                             float edgeFactor = smoothstep(0.7, 1.0, distance(uv, vec2(0.5)) * 2.0); // Adjusted edge detection

//                             // Subtle frost pattern
//                             float frostPattern =
//                                 sin(uv.x * 40.0 + time * 0.0003) *
//                                 sin(uv.y * 40.0 + time * 0.0005);

//                             float frost = edgeFactor * frostPattern * uIntensity * 0.08; // Reduced from 0.15
//                             vec3 frostColor = vec3(0.8, 0.9, 1.0);

//                             gl_FragColor = vec4(mix(color.rgb, frostColor, frost), 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uIntensity: { type: "1f", value: 0.4 }, // Reduced from 0.8
//                     },
//                 };
//             case ShaderType.UNDERWATER:
//                 return {
//                     key: "UnderwaterShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform float time;
//                         uniform vec2 resolution;
//                         uniform float uWaveStrength;
//                         uniform float uCausticsIntensity;

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;

//                             // Underwater wave distortion - REDUCED EFFECT
//                             float waveFreq = 20.0;
//                             float timeScale = 0.001; // Reduced from 0.002
//                             float distAmount = uWaveStrength * 0.002; // Reduced from 0.003

//                             float distAmountX = sin(uv.y * waveFreq + time * timeScale) * distAmount;
//                             float distAmountY = cos(uv.x * waveFreq + time * timeScale * 0.8) * distAmount;

//                             vec2 distCoord = vec2(
//                                 uv.x + distAmountX,
//                                 uv.y + distAmountY
//                             );

//                             vec4 color = texture2D(uMainSampler, distCoord);

//                             // Blue tint for underwater effect - REDUCED EFFECT
//                             color.r *= 0.9;  // Increased from 0.8 (less effect)
//                             color.g *= 0.95; // Increased from 0.9 (less effect)
//                             color.b = min(1.0, color.b * 1.1); // Reduced from 1.2

//                             // Underwater caustics (light patterns) - REDUCED EFFECT
//                             float causticsFreq = 40.0;
//                             float caustics1 = sin(uv.x * causticsFreq + time * 0.008) *
//                                             sin(uv.y * causticsFreq + time * 0.008);
//                             float caustics2 = sin(uv.x * causticsFreq * 0.8 + time * 0.01) *
//                                             sin(uv.y * causticsFreq * 1.2 + time * 0.007);

//                             float caustics = max(caustics1, caustics2) * 0.5 + 0.5;
//                             color.rgb += vec3(0.0, 0.08, 0.15) * caustics * uCausticsIntensity; // Reduced from vec3(0.0, 0.1, 0.2)

//                             // Add slight depth fog - REDUCED EFFECT
//                             float depthFog = smoothstep(0.5, 1.0, distance(uv, vec2(0.5))); // Adjusted from 0.4
//                             color.rgb = mix(color.rgb, vec3(0.0, 0.05, 0.15), depthFog * 0.1); // Reduced from 0.2

//                             gl_FragColor = vec4(color.rgb, 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uWaveStrength: { type: "1f", value: 0.6 }, // Reduced from 1.0
//                         uCausticsIntensity: { type: "1f", value: 0.1 }, // Reduced from 0.15
//                     },
//                 };
//             case ShaderType.NIGHT:
//                 return {
//                     key: "NightShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform float time;
//                         uniform vec2 resolution;
//                         uniform float uStarDensity;

//                         float random(vec2 st) {
//                             return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
//                         }

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;
//                             vec4 color = texture2D(uMainSampler, uv);

//                             // Darken the scene - REDUCED EFFECT
//                             color.rgb *= 0.85; // Increased from 0.7 (less darkening)

//                             // Add blue tint to simulate night - REDUCED EFFECT
//                             color.r *= 0.9;  // Increased from 0.85 (less effect)
//                             color.g *= 0.95; // Increased from 0.9 (less effect)
//                             color.b = min(1.0, color.b * 1.05); // Reduced from 1.1

//                             // Create subtle vignette effect - REDUCED EFFECT
//                             float vignette = smoothstep(0.5, 0.8, distance(uv, vec2(0.5))); // Adjusted from 0.4, 0.75
//                             color.rgb *= (1.0 - vignette * 0.2); // Reduced from 0.3

//                             // Add stars (only visible in darker areas) - REDUCED DENSITY
//                             vec2 starCoord = floor(uv * 200.0);
//                             float starRandom = random(starCoord);

//                             if (starRandom > (1.0 - uStarDensity * 0.03)) { // Reduced from 0.05
//                                 float starBrightness = random(starCoord + 0.1) * 0.5 + 0.5;
//                                 float starTwinkle = sin(time * 0.001 + starRandom * 10.0) * 0.5 + 0.5;

//                                 // Only show stars in dark areas
//                                 float luminance = (color.r + color.g + color.b) / 3.0;
//                                 float starVisibility = max(0.0, 0.3 - luminance) * 2.0; // Adjusted from 0.4 and 2.5

//                                 if (starVisibility > 0.0) {
//                                     vec3 starColor = vec3(1.0, 1.0, random(starCoord + 0.2) * 0.5 + 0.5);
//                                     color.rgb += starColor * starBrightness * starTwinkle * starVisibility * 0.3; // Reduced from 0.5
//                                 }
//                             }

//                             gl_FragColor = vec4(color.rgb, 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uStarDensity: { type: "1f", value: 0.7 }, // Reduced from 1.0
//                     },
//                 };
//             case ShaderType.CAVE:
//                 return {
//                     key: "CaveShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform float time;
//                         uniform vec2 resolution;
//                         uniform float uDarknessLevel;

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;
//                             vec4 color = texture2D(uMainSampler, uv);

//                             // Darken overall scene - REDUCED EFFECT
//                             color.rgb *= (1.0 - uDarknessLevel * 0.2); // Reduced from 0.3

//                             // Add subtle blue-green tint to simulate phosphorescent lichen - REDUCED EFFECT
//                             color.r *= 0.95; // Increased from 0.9 (less effect)
//                             color.g *= 1.03; // Reduced from 1.05
//                             color.b *= 1.05; // Reduced from 1.1

//                             // Strong vignette effect to simulate limited visibility - REDUCED EFFECT
//                             float vignette = smoothstep(0.3, 0.8, distance(uv, vec2(0.5))); // Adjusted from 0.2, 0.7
//                             color.rgb *= (1.0 - vignette * uDarknessLevel * 0.4); // Reduced from 0.7

//                             // Add subtle dust particles floating - REDUCED EFFECT
//                             vec2 dustCoord = fract(uv * 5.0 + vec2(time * 0.0001, time * -0.00007));
//                             float dust =
//                                 smoothstep(0.3, 0.5, sin(dustCoord.x * 20.0) * sin(dustCoord.y * 20.0) * 0.5 + 0.5) *
//                                 smoothstep(0.4, 0.6, sin(time * 0.0003 + uv.x * 5.0) * sin(time * 0.0004 + uv.y * 5.0) * 0.5 + 0.5);

//                             dust *= (1.0 - vignette * 0.8) * 0.02; // Reduced from 0.04
//                             color.rgb += vec3(0.6, 0.7, 0.9) * dust;

//                             gl_FragColor = vec4(color.rgb, 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         time: { type: "1f", value: 0.0 },
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                         uDarknessLevel: { type: "1f", value: 0.5 }, // Reduced from 0.8
//                     },
//                 };
//             default:
//                 return {
//                     key: "DefaultShader",
//                     fragmentShader: `
//                         precision mediump float;
//                         uniform sampler2D uMainSampler;
//                         uniform vec2 resolution;

//                         void main() {
//                             vec2 uv = gl_FragCoord.xy / resolution;
//                             vec4 color = texture2D(uMainSampler, uv);

//                             // Subtle enhancement
//                             color.rgb = (color.rgb - 0.5) * 1.02 + 0.5; // Reduced from 1.05

//                             gl_FragColor = vec4(color.rgb, 1.0);
//                         }
//                     `,
//                     uniforms: {
//                         resolution: {
//                             type: "2f",
//                             value: [this.scale.width, this.scale.height],
//                         },
//                     },
//                 };
//         }
//     }
//     update(time: number) {
//         // Update shader uniforms if we have an active shader
//         if (this.currentShader && this.activeShaderType !== ShaderType.NONE) {
//             // Update time uniform
//             this.currentShader.setUniform("time", time);

//             // Update shader-specific animated values
//             switch (this.activeShaderType) {
//                 case ShaderType.FOG:
//                     // Animate fog density slightly
//                     const fogPulse = Math.sin(time * 0.0005) * 0.1 + 0.7;
//                     this.currentShader.setUniform("uDensity", fogPulse);
//                     break;

//                 case ShaderType.WARM:
//                     // Subtle heat intensity fluctuation
//                     const heatPulse = Math.sin(time * 0.001) * 0.1 + 0.7;
//                     this.currentShader.setUniform("uIntensity", heatPulse);
//                     break;

//                 case ShaderType.UNDERWATER:
//                     // Wave strength could vary with "currents"
//                     const waveStrength = Math.sin(time * 0.0003) * 0.3 + 1.0;
//                     this.currentShader.setUniform(
//                         "uWaveStrength",
//                         waveStrength
//                     );

//                     // Caustics intensity could vary with "time of day"
//                     const causticsIntensity =
//                         Math.sin(time * 0.0002) * 0.05 + 0.15;
//                     this.currentShader.setUniform(
//                         "uCausticsIntensity",
//                         causticsIntensity
//                     );
//                     break;

//                 case ShaderType.NIGHT:
//                     // Stars might twinkle more/less
//                     const starActivity = Math.sin(time * 0.0001) * 0.3 + 1.0;
//                     this.currentShader.setUniform("uStarDensity", starActivity);
//                     break;

//                 case ShaderType.CAVE:
//                     // Cave darkness might shift slightly
//                     const darknessPulse = Math.sin(time * 0.0002) * 0.1 + 0.8;
//                     this.currentShader.setUniform(
//                         "uDarknessLevel",
//                         darknessPulse
//                     );
//                     break;
//             }
//         }
//     }

//     public getActiveShaderType(): ShaderType {
//         return this.activeShaderType;
//     }

//     public resizeShader() {
//         // Update shader when game size changes
//         if (this.currentShader) {
//             this.currentShader.setUniform("resolution", [
//                 this.scale.width,
//                 this.scale.height,
//             ]);
//         }

//         // Resize the shader image
//         if (this.shaderImage) {
//             this.shaderImage
//                 .setPosition(this.scale.width / 2, this.scale.height / 2)
//                 .setDisplaySize(this.scale.width, this.scale.height);
//         }
//     }
// }
