import Phaser from "phaser";
import { GameScene } from "../../types/scenes";
import { InputComponent } from "../../components/input/inputComponent";
import { CharactrerGameObject } from "../../components/gameobject/common/characterGameObject";
import { AnimationConfig } from "../../components/gameobject/animationComponent";
import {
    ASSET_KEYS,
    ENIMIE_SLIME_ANIMATION_KEYS,
} from "../../../common/assets";
import {
    ENIMIE_SLIME_HURT_PUSH_BACK_SPEED,
    ENIMIE_SLIME_SPEED,
    ENIMIE_SLIME_START_MAX_HEALTH,
} from "../../../config";
import { IdleState } from "../../components/statemachine/states/character/idleState";
import { MoveState } from "../../components/statemachine/states/character/moveState";
import { CHARACTER_STATES } from "../../components/statemachine/states/character/characterStates";
import { HurtState } from "../../components/statemachine/states/character/hurtState";
import { State } from "../../components/statemachine/statemachine";
import { DeathState } from "../../components/statemachine/states/character/deathState";

type TEnimie = {
    scene: GameScene;
    positions: { x: number; y: number };
};

export class EnimieSlime extends CharactrerGameObject {
    private detectionRadius: number = 90;
    private followingPlayer: boolean = false;
    private player: Phaser.GameObjects.Sprite | null = null;
    private initialPosition: { x: number; y: number };
    private _scene: GameScene;
    constructor(config: TEnimie) {
        const { scene } = config;

        const animationConfig: AnimationConfig = {
            // Animation config remains the same
            WALK_DOWN: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.WALK_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_UP: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.WALK_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_LEFT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.WALK_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_RIGHT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.WALK_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_DOWN: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.IDLE_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_UP: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.IDLE_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_LEFT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.IDLE_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_RIGHT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.IDLE_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            HURT_DOWN: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.HURT_DOWN,
                repeat: 0,
                ignoreIfPlaying: false,
            },
            HURT_UP: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.HURT_UP,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            HURT_LEFT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.HURT_LEFT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            HURT_RIGHT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.HURT_RIGHT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_DOWN: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.DIE_DOWN,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_UP: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.DIE_UP,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_LEFT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.DIE_LEFT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_RIGHT: {
                key: ENIMIE_SLIME_ANIMATION_KEYS.DIE_RIGHT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
        };

        super({
            scene: config.scene,
            positions: config.positions,
            assetKey: ASSET_KEYS.ENIMIE_SLIME,
            inputComponent: new InputComponent(),
            animationConfig,
            speed: ENIMIE_SLIME_SPEED,
            id: `enimie_slime${Phaser.Math.RND.uuid()}`,
            isPlayer: false,
            isInvulnarable: false,
            maxLife: ENIMIE_SLIME_START_MAX_HEALTH,
        });
        this._scene = scene;
        // Save initial position for returning when player is out of range
        this.initialPosition = { x: config.positions.x, y: config.positions.y };
        console.log(this.initialPosition);
        // Find the player in the scene
        this.findPlayer();

        // Initialize state machine
        this._stateMachine.addState(new IdleState(this));
        this._stateMachine.addState(new MoveState(this));
        this._stateMachine.addState(
            new HurtState(this, ENIMIE_SLIME_HURT_PUSH_BACK_SPEED, () => {
                console.log("enimie hurt");
            }) as State
        );

        this._stateMachine.addState(new DeathState(this));
        this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

        // Add update event
        scene.events.on(Phaser.Scenes.Events.UPDATE, this.updateAI, this);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.updateAI, this);
        });
    }

    private findPlayer(): void {
        this.player = this._scene.children
            .getChildren()
            .find(
                (child): child is CharactrerGameObject =>
                    "id" in child && child.id === "player"
            ) as Phaser.GameObjects.Sprite;

        //  as Phaser.GameObjects.Sprite;
    }

    private updateAI(): void {
        if (!this.player) {
            this.findPlayer();

            return;
        }

        // Calculate distance to player
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
        // console.log(distance);
        // console.log(this.followingPlayer);
        // Check if player is within detection radius
        if (distance <= this.detectionRadius) {
            this.followingPlayer = true;

            // Calculate direction to player
            const angleToPlayer = Phaser.Math.Angle.Between(
                this.x,
                this.y,
                this.player.x,
                this.player.y
            );

            // Convert angle to direction
            const dirX = Math.cos(angleToPlayer);
            const dirY = Math.sin(angleToPlayer);

            // Update input component to simulate key presses
            const control = this.controls;
            control.reset();

            // Set appropriate input based on direction
            if (Math.abs(dirX) > Math.abs(dirY)) {
                // Moving horizontally
                if (dirX > 0) {
                    control.isRightDown = true;
                } else {
                    control.isLeftDown = true;
                }
            } else {
                // Moving vertically
                if (dirY > 0) {
                    control.isDownDown = true;
                } else {
                    control.isUpDown = true;
                }
            }
        } else if (this.followingPlayer) {
            // Player is outside detection radius BUT we were following them
            // Important: DO NOT set followingPlayer = false yet
            const control = this.controls;
            // Calculate vector to initial position
            const dx = this.initialPosition.x - this.x;
            const dy = this.initialPosition.y - this.y;

            // Return distance
            const returnDistance = Math.sqrt(dx * dx + dy * dy);

            if (returnDistance > 5) {
                // Not close enough to initial position yet - keep moving toward it
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Moving horizontally
                    control.isRightDown = dx > 0;
                    control.isLeftDown = dx < 0;
                } else {
                    // Moving vertically
                    control.isDownDown = dy > 0;
                    control.isUpDown = dy < 0;
                }
            } else {
                const control = this.controls;
                // We've reached the initial position

                this.followingPlayer = false; // NOW we can set followingPlayer to false
                control.reset();
            }
        }
        super.update();
    }

    // Method to set detection radius if needed
    public setDetectionRadius(radius: number): void {
        this.detectionRadius = radius;
    }
}
