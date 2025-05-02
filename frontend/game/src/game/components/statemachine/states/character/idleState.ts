import { CharactrerGameObject } from "../../../gameobject/common/characterGameObject";
import { BaseCharacterState } from "./baseChacacterState";
import { CHARACTER_STATES } from "./characterStates";

export class IdleState extends BaseCharacterState {
    constructor(gameObject: CharactrerGameObject) {
        super(CHARACTER_STATES.IDLE_STATE, gameObject);
    }
    public onEnter(): void {
        if (!this._gameObject || !this._gameObject.animationComponent) {
            console.error("Game object or animation component not initialized");
            return;
        }

        this._gameObject.animationComponent.playAnimation(
            `IDLE_${this._gameObject.direction}`
        );
        this._gameObject.body.velocity.x = 0;
        this._gameObject.body.velocity.y = 0;
    }
    onUpdate(): void {
        const controls = this._gameObject.controls;
        if (controls.isActionKeyJustDown) {
            this._stateMachine.setState(CHARACTER_STATES.ATTACK_STATE);
            return;
        }
        if (
            !controls.isUpDown &&
            !controls.isDownDown &&
            !controls.isLeftDown &&
            !controls.isRightDown
        ) {
            return;
        }
        this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE);
    }
}
