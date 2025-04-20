import Phaser from "phaser";
import { Direction } from "grid-engine";
import { GameScene } from "../types/scenes";

export class Player {
    private sprite: Phaser.GameObjects.Sprite;
    private scene: GameScene;
    public readonly id: string = "Player";

    constructor(scene: GameScene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, "Player");
        scene.physics.add.existing(this.sprite);
    }
    public getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite;
    }
    public getId(): string {
        return this.id;
    }

    public getGridEngineConfig() {
        return {
            id: this.id,
            sprite: this.sprite,
            startPosition: { x: 20, y: 60 },
            speed: 10,
            disableAutomaticDepthSorting: true,
            // Optional: if you don't need character-to-character collisions
            ignoreCollisions: true,
            walkingAnimationMapping: {
                up: {
                    leftFoot: 7,
                    standing: 6,
                    rightFoot: 8,
                },
                down: {
                    leftFoot: 1,
                    standing: 0,
                    rightFoot: 2,
                },
                left: {
                    leftFoot: 4,
                    standing: 3,
                    rightFoot: 5,
                },
                right: {
                    leftFoot: 10,
                    standing: 9,
                    rightFoot: 11,
                },
            },
        };
    }

    public setupMovementControls() {
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const wasd = this.scene.input.keyboard.addKeys("W,S,A,D") as {
            W: Phaser.Input.Keyboard.Key;
            S: Phaser.Input.Keyboard.Key;
            A: Phaser.Input.Keyboard.Key;
            D: Phaser.Input.Keyboard.Key;
        };
        // Game loop update
        this.scene.events.on("update", () => {
            // Skip if player is already moving
            // if (this.scene.gridEngine.isMoving(this.id)) {
            //     return;
            // }
            //lern movemebnt and motion stuff
            // Handle movement based on key press
            switch (true) {
                case cursors.left.isDown || wasd.A.isDown:
                    this.scene.gridEngine.move(this.id, Direction.LEFT);
                    break;
                case cursors.right.isDown || wasd.D.isDown:
                    this.scene.gridEngine.move(this.id, Direction.RIGHT);
                    break;
                case cursors.up.isDown || wasd.W.isDown:
                    this.scene.gridEngine.move(this.id, Direction.UP);
                    break;
                case cursors.down.isDown || wasd.S.isDown:
                    this.scene.gridEngine.move(this.id, Direction.DOWN);
                    break;
            }
        });
    }
    public update() {}
}
