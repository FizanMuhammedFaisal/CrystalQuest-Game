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

export function setupControls(scene: Game, camera: GameCamera): void {
    const areaSize = scene.objectByAreaId[scene.levelData.areaId].area;
    scene.cameras.main.setBounds(
        areaSize.x,
        areaSize.y,
        areaSize.width,
        areaSize.height
    );
    scene.cameras.main.startFollow(scene.player);
}
