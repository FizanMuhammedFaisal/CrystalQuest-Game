import { Game } from "../Game";
import { GameCamera } from "./camera";

export class GameControls {
    constructor(scene: Game, camera: GameCamera) {
        this.setupZoomControls(scene, camera);
    }

    private setupZoomControls(scene: Game, camera: GameCamera) {
        scene.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                _: any,
                __: any,
                deltaY: number
            ) => {
                camera.handleZoom(pointer, deltaY);
            }
        );
    }
}

export function setupControls(scene: Game, camera: GameCamera): GameControls {
    return new GameControls(scene, camera);
}
