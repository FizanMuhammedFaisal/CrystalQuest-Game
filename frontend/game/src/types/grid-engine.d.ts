import { Scene } from "phaser";

declare module "grid-engine" {
    export class GridEngine {
        create(tilemap: Phaser.Tilemaps.Tilemap, config: any): void;
        move(charId: string, direction: string): void;
        isMoving(charId: string): boolean;
        movementStarted(): any;
        movementStopped(): any;
    }
}

// This is the important part that makes gridEngine available on Scene
declare module "phaser" {
    namespace Phaser {
        interface Scene {
            gridEngine: GridEngine;
        }
    }
}
