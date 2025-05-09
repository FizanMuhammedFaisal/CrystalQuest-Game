import { Scene } from "phaser";
import { ShaderScene } from "../scenes/shaderScene";

export enum ShaderType {
    FOG = "fog",
    WARM = "warm",
    COLD = "cold",
    UNDERWATER = "underwater",
    NIGHT = "night",
    CAVE = "cave",
    NONE = "none",
}

/**
 * ShaderManager acts as a bridge between your main game scene and the ShaderScene
 * This allows you to easily apply shaders without worrying about implementation details
 */
export class ShaderManager {
    private scene: Scene;
    private shaderScene: ShaderScene | null = null;
    private activeShaderType: ShaderType = ShaderType.NONE;

    constructor(scene: Scene) {
        this.scene = scene;
        this.setupShaderScene();

        // Cleanup on scene shutdown
        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);

        // Handle window resize
        this.scene.scale.on("resize", this.handleResize, this);
    }

    private setupShaderScene() {
        // Check if ShaderScene exists already
        if (this.scene.game.scene.getScene("shaderScene")) {
            this.shaderScene = this.scene.game.scene.getScene(
                "shaderScene"
            ) as ShaderScene;
        } else {
            // Create ShaderScene if it doesn't exist
            this.scene.game.scene.add("shaderScene", ShaderScene, true);
            this.shaderScene = this.scene.game.scene.getScene(
                "shaderScene"
            ) as ShaderScene;
        }
    }

    public getShaderType(areaId: number): ShaderType {
        // Map area IDs to shader types
        console.log("Getting shader type for area:", areaId);
        switch (areaId) {
            case 1:
                return ShaderType.FOG;
            case 2:
                return ShaderType.WARM;
            case 3:
                return ShaderType.COLD;
            case 4:
                return ShaderType.UNDERWATER;
            case 5:
                return ShaderType.NIGHT;
            case 6:
                return ShaderType.CAVE;
            default:
                return ShaderType.NONE;
        }
    }

    public applyShader(shaderType: ShaderType, duration: number = 1000) {
        // Safety check for shader scene
        if (!this.shaderScene) {
            console.warn("Shader scene not available");
            return;
        }

        console.log("Applying shader:", shaderType);

        // Remember the active shader type
        this.activeShaderType = shaderType;

        // Apply shader through shader scene
        this.shaderScene.applyShader(shaderType, duration);
    }

    public getActiveShaderType(): ShaderType {
        return this.activeShaderType;
    }

    private handleResize() {
        // Update shader scene when window resizes
        if (this.shaderScene) {
            this.shaderScene.resizeShader();
        }
    }

    public destroy() {
        // Clean up event listeners
        this.scene.scale.off("resize", this.handleResize, this);

        // Don't destroy the ShaderScene as it may be used by other scenes
        // Just clear our reference to it
        this.shaderScene = null;
    }
}
