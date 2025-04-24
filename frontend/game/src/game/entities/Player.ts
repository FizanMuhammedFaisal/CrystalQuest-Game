import Phaser from "phaser";
import { GameScene } from "../types/scenes";

import { ControlsComponent } from "../components/gameobject/controlsComponent";
import { InputComponent } from "../components/input/inputComponent";

import { StateMachine } from "../components/statemachine/statemachine";
import { IdleState } from "../components/statemachine/states/character/idleState";
import { CHARACTER_STATES } from "../components/statemachine/states/character/characterStates";
import { MoveState } from "../components/statemachine/states/character/moveState";
import { SpeedsComponent } from "../components/gameobject/speedComponent";
import { PLAYER_SPEED } from "../../config";
import { DirectionComponent } from "../components/gameobject/directionComponent";
import { Direction } from "../types/types";
import {
    AnimationComponent,
    AnimationConfig,
} from "../components/gameobject/animationComponent";
import { PLAYER_ANIMATION_KEYS } from "../../common/assets";
type TPlayer = {
    scene: GameScene;
    positions: { x: number; y: number };
    assetKey: string;
    controls: InputComponent;
};
export class Player extends Phaser.Physics.Arcade.Sprite {
    private controlsComponent: ControlsComponent;
    private stateMachine: StateMachine;
    private speedComponent: SpeedsComponent;
    private directionComponent: DirectionComponent;
    private _animationComponent: AnimationComponent;
    constructor(config: TPlayer) {
        const { scene, positions, assetKey, controls } = config;
        const { x, y } = positions;
        super(scene, x, y, assetKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        const animationConfig: AnimationConfig = {
            WALK_DOWN: {
                key: PLAYER_ANIMATION_KEYS.WALK_DOWN,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_UP: {
                key: PLAYER_ANIMATION_KEYS.WALK_UP,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_LEFT: {
                key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_DOWN: {
                key: PLAYER_ANIMATION_KEYS.IDLE_DOWN,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_UP: {
                key: PLAYER_ANIMATION_KEYS.IDLE_UP,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_LEFT: {
                key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
        };
        // Initialize components first
        this.controlsComponent = new ControlsComponent(this, controls);
        this.speedComponent = new SpeedsComponent(this, PLAYER_SPEED);
        this.directionComponent = new DirectionComponent(this);
        this._animationComponent = new AnimationComponent(
            this,
            animationConfig
        );

        // Then initialize state machine
        this.stateMachine = new StateMachine("player");
        this.stateMachine.addState(new IdleState(this));
        this.stateMachine.addState(new MoveState(this));
        this.stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

        scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        });
    }
    public getGridEngineConfig() {
        return {
            id: this.id,
            startPosition: { x: 20, y: 60 },
            ignoreCollisions: true,
        };
    }
    get controls(): InputComponent {
        return this.controlsComponent.controls;
    }
    get speed(): number {
        return this.speedComponent.speed;
    }
    get direction(): Direction {
        return this.directionComponent.direction;
    }
    set direction(direction: Direction) {
        this.directionComponent.direction = direction;
    }
    public update(): void {
        this.stateMachine.update();
    }
    get animationComponent(): AnimationComponent {
        return this._animationComponent;
    }
}
