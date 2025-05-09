//since player and enimie wil have same logic to be reused this is a abstraction for it

import Phaser from "phaser";
import { AnimationComponent, AnimationConfig } from "../animationComponent";
import { DirectionComponent } from "../directionComponent";
import { SpeedsComponent } from "../speedComponent";
import { StateMachine } from "../../statemachine/statemachine";
import { ControlsComponent } from "../controlsComponent";

import { InputComponent } from "../../input/inputComponent";

import { Direction } from "../../../types/types";
import { InvulnarableComponent } from "../invulnarableComponent";
import { CHARACTER_STATES } from "../../statemachine/states/character/characterStates";
import { LifeComponent } from "../lifeComponent";
import { DataManager } from "../../../../common/dataManager";
type CharacterConfig = {
    scene: Phaser.Scene;
    positions: { x: number; y: number };
    assetKey: string;
    inputComponent: InputComponent;
    animationConfig: AnimationConfig;
    speed: number;
    id: string;
    isPlayer?: boolean;
    isInvulnarable?: boolean;
    invulnarableAfterHitAnimtionDuration?: number;
    maxLife: number;
    currentLife?: number;
};

export abstract class CharactrerGameObject extends Phaser.Physics.Arcade
    .Sprite {
    protected _controlsComponent: ControlsComponent;
    protected _stateMachine: StateMachine;
    protected _speedComponent: SpeedsComponent;
    protected _directionComponent: DirectionComponent;
    protected _animationComponent: AnimationComponent;
    protected _isPlayer: boolean;
    public id: string;
    protected _invulnarableComponent: InvulnarableComponent;
    protected _lifeComponent: LifeComponent;
    protected _isDefeated: boolean;
    constructor(config: CharacterConfig) {
        const {
            scene,
            positions,
            assetKey,
            inputComponent,
            animationConfig,
            speed,
            id,
            isPlayer,
            isInvulnarable,
            invulnarableAfterHitAnimtionDuration,
            maxLife,
            currentLife,
        } = config;
        const { x, y } = positions;
        super(scene, x, y, assetKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.id = id;
        // Initialize components first
        this._controlsComponent = new ControlsComponent(this, inputComponent);
        this._speedComponent = new SpeedsComponent(this, speed);
        this._directionComponent = new DirectionComponent(this);
        this._animationComponent = new AnimationComponent(
            this,
            animationConfig
        );
        this._invulnarableComponent = new InvulnarableComponent(
            this,
            isInvulnarable || false,
            invulnarableAfterHitAnimtionDuration
        );

        this._lifeComponent = new LifeComponent(this, maxLife, currentLife);
        // Then initialize state machine
        this._stateMachine = new StateMachine(id);

        //general Configuration
        this._isPlayer = isPlayer ?? false;
        this._isDefeated = false;
    }
    get isDefeated(): boolean {
        return this._isDefeated;
    }
    get controls(): InputComponent {
        return this._controlsComponent.controls;
    }
    get speed(): number {
        return this._speedComponent.speed;
    }
    get direction(): Direction {
        return this._directionComponent.direction;
    }
    set direction(direction: Direction) {
        this._directionComponent.direction = direction;
    }
    public update(): void {
        this._stateMachine.update();
    }
    get animationComponent(): AnimationComponent {
        return this._animationComponent;
    }
    get isEnemy(): boolean {
        return !this._isPlayer;
    }
    hit(direction: Direction, damage: number): void {
        // If already defeated or currently invulnerable, do nothing
        if (this._isDefeated || this._invulnarableComponent.invulnarable) {
            return;
        }

        // Take damage
        this._lifeComponent.takeDamage(damage);

        // Update UI if this is the player
        if (this._isPlayer) {
            DataManager.instance.updatePlayerCurrentHealth(
                this._lifeComponent.life
            );
        }

        // Check if defeated
        if (this._lifeComponent.life === 0) {
            this._isDefeated = true;
            this._stateMachine.setState(
                CHARACTER_STATES.DEATH_STATE,
                direction
            );
            return;
        }

        // Set hurt state
        this._stateMachine.setState(CHARACTER_STATES.HURT_STATE, direction);

        // Make player invulnerable for a few seconds
        this._invulnarableComponent.invulnarable = true;

        // Set a timer to remove invulnerability after X seconds
        this.scene.time.delayedCall(2000, () => {
            this._invulnarableComponent.invulnarable = false;
        });
    }
    get invalueableComponent(): InvulnarableComponent {
        return this._invulnarableComponent;
    }
    public disableObject(): void {
        (this.body as Phaser.Physics.Arcade.Body).enable = false;
        this.active = false;
        if (!this._isPlayer) {
            this.visible = false;
        }
    }
    public enableObject(): void {
        if (this._isDefeated) {
            return;
        }
        (this.body as Phaser.Physics.Arcade.Body).enable = true;
        this.active = true;
        this.visible = true;
    }
}
