import { CHARACTER_ANIMATIONS } from "../../../../../common/assets";
import { DIRECTION } from "../../../../../common/common";
import { HURT_PUSH_BACK_DELAY } from "../../../../../config";
import { Direction } from "../../../../types/types";
import { CharactrerGameObject } from "../../../gameobject/common/characterGameObject";
import { BaseCharacterState } from "./baseChacacterState";
import { CHARACTER_STATES } from "./characterStates";

export class HurtState extends BaseCharacterState {
    private hurtPushBackSpeed: number;
    private onHurtCallback: () => void;
    private nextState: string;
    constructor(
        gameObject: CharactrerGameObject,
        hurtPushBackSpeed: number,
        onHurtCallback: () => void = () => undefined,
        nextState: string = CHARACTER_STATES.IDLE_STATE
    ) {
        super(CHARACTER_STATES.HURT_STATE, gameObject);
        this.hurtPushBackSpeed = hurtPushBackSpeed;
        this.onHurtCallback = onHurtCallback;
        this.nextState = nextState;
    }
    public onEnter(args: unknown[]): void {
        const attackDirection = args[0] as Direction;
        const body = this._gameObject.body;

        //reset body velocity
        body.velocity.x = 0;
        body.velocity.y = 0;

        switch (attackDirection) {
            case DIRECTION.DOWN: {
                body.velocity.y = this.hurtPushBackSpeed;
                break;
            }
            case DIRECTION.UP: {
                body.velocity.y = -this.hurtPushBackSpeed;
                break;
            }
            case DIRECTION.LEFT: {
                body.velocity.x = -this.hurtPushBackSpeed;
                break;
            }
            case DIRECTION.RIGHT: {
                body.velocity.x = this.hurtPushBackSpeed;
                break;
            }
        }
        (this._gameObject.scene as unknown as Phaser.Scene).time.delayedCall(
            HURT_PUSH_BACK_DELAY,
            () => {
                body.velocity.x = 0;
                body.velocity.y = 0;
            }
        );
        this._gameObject.invalueableComponent.invulnarable = true;
        this.onHurtCallback();
        this._gameObject.animationComponent.playAnimation(
            CHARACTER_ANIMATIONS.HURT_DOWN,
            () => {
                this.transition();
            }
        );
    }
    private transition(): void {
        (this._gameObject.scene as unknown as Phaser.Scene).time.delayedCall(
            this._gameObject.invalueableComponent
                .invulnarableAfterHitAnimtionDuration,
            () => {
                this._gameObject.invalueableComponent.invulnarable = false;
            }
        );
        this._stateMachine.setState(this.nextState);
    }
}
