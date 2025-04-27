// import { Game } from "../Game";

import { Game } from "../Game";

// export class GameCamera {
//     private currentZoom: number = 1.4;
//     private readonly minZoom: number = 1.1;
//     private readonly maxZoom: number = 9;
//     private camera: Phaser.Cameras.Scene2D.Camera;
//     private isDragging: boolean = false;
//     private cameraDragStartX: number = 0;
//     private cameraDragStartY: number = 0;
//     private isFollowingPlayer: boolean = true;

//     constructor(scene: Game) {
//         this.camera = scene.cameras.main;
//         this.setupCamera(scene);
//         this.setupControls(scene);
//     }

//     private setupCamera(scene: Game) {
//         this.camera.setZoom(this.currentZoom);
//         this.followPlayer(scene);
//         this.camera.setBounds(
//             0,
//             0,
//             scene.tilemap.widthInPixels,
//             scene.tilemap.heightInPixels
//         );
//         this.camera.setRoundPixels(true);
//     }

//     private setupControls(scene: Game) {
//         // Setup drag controls
//         scene.input.on("pointerdown", () => {
//             this.isDragging = true;
//             this.isFollowingPlayer = false;
//             this.camera.stopFollow();
//             this.cameraDragStartX = this.camera.scrollX;
//             this.cameraDragStartY = this.camera.scrollY;
//         });

//         scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
//             if (pointer.isDown && this.isDragging) {
//                 this.camera.scrollX =
//                     this.cameraDragStartX +
//                     (pointer.downX - pointer.x) / this.camera.zoom;
//                 this.camera.scrollY =
//                     this.cameraDragStartY +
//                     (pointer.downY - pointer.y) / this.camera.zoom;
//             }
//         });

//         scene.input.on("pointerup", () => {
//             this.isDragging = false;
//             // Don't follow player automatically anymore
//             // Camera stays where it was dragged to
//         });
//     }

//     private followPlayer(scene: Game) {
//         const playerSprite = scene.player;
//         this.camera.startFollow(playerSprite, true, 0.1, 0.1);
//         this.isFollowingPlayer = true;
//     }

//     public handleZoom(pointer: Phaser.Input.Pointer, deltaY: number) {
//         // Get the current world point under pointer
//         const worldPoint = this.camera.getWorldPoint(pointer.x, pointer.y);

//         // Calculate new zoom
//         const newZoom = Phaser.Math.Clamp(
//             this.camera.zoom - this.camera.zoom * 0.001 * deltaY,
//             this.minZoom,
//             this.maxZoom
//         );

//         // Set the new zoom level
//         this.camera.zoom = newZoom;
//         this.currentZoom = newZoom;

//         // Update camera matrix for correct world point calculation
//         this.camera.preRender();

//         // Get new world point after zoom
//         const newWorldPoint = this.camera.getWorldPoint(pointer.x, pointer.y);

//         // Adjust camera position to keep pointer at the same world position
//         this.camera.scrollX -= newWorldPoint.x - worldPoint.x;
//         this.camera.scrollY -= newWorldPoint.y - worldPoint.y;

//         if (this.isFollowingPlayer) {
//             this.camera.stopFollow();
//             this.isFollowingPlayer = false;
//         }
//     }

//     public onPlayerMove(scene: Game) {
//         if (!this.isFollowingPlayer && !this.isDragging) {
//             const playerSprite = scene.player;
//             this.camera.pan(
//                 playerSprite.x,
//                 playerSprite.y,
//                 500,
//                 "Quad.easeOut",
//                 true,
//                 (_camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
//                     if (progress === 1) {
//                         this.followPlayer(scene);
//                     }
//                 }
//             );
//         }
//     }

//     update(scene: Game) {}
// }

// export function setupCamera(scene: Game): GameCamera {
//     return new GameCamera(scene);
// }
export function setupCamera(scene: Game): void {
    const areaSize = scene.objectByAreaId[scene.levelData.areaId].area;
    console.log(areaSize);

    scene.cameras.main.setBounds(
        areaSize.x,
        areaSize.y - areaSize.height,
        areaSize.width,
        areaSize.height
    );

    // Set initial zoom level
    scene.cameras.main.setZoom(1.8);

    // Add these settings to smooth out camera movement
    scene.cameras.main.setRoundPixels(true);
    scene.cameras.main.setLerp(0.1, 0.1); // Smooth camera movement
    scene.cameras.main.setFollowOffset(
        -areaSize.width / 2,
        -areaSize.height / 2
    );

    // Start following player with smoother parameters
    scene.cameras.main.startFollow(
        scene.player,
        true, // Round pixels
        0.1, // Lerp X
        0.1 // Lerp Y
    );
}
