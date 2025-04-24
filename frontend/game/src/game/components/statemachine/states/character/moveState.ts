import { DIRECTION } from "../../../../../common/common";
import { Player } from "../../../../entities/Player";
import { Direction } from "../../../../types/types";
import { BaseCharacterState } from "./baseChacacterState";
import { CHARACTER_STATES } from "./characterStates";

export class MoveState extends BaseCharacterState {
    constructor(gameObject: Player) {
        super(CHARACTER_STATES.MOVE_STATE, gameObject);
    }
    private updateVelocity(isX: boolean, value: number): void {
        if (isX) {
            this._gameObject.body.velocity.x = value;
            return;
        }
        this._gameObject.body.velocity.y = value;
    }
    private normalizeVelocity() {
        this._gameObject.body.velocity
            .normalize()
            .scale(this._gameObject.speed);
    }

    onUpdate(): void {
        const controls = this._gameObject.controls;
        if (
            !controls.isUpDown &&
            !controls.isDownDown &&
            !controls.isLeftDown &&
            !controls.isRightDown
        ) {
            this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
            return;
        }
        if (controls.isUpDown) {
            this.updateVelocity(false, -1);
            this.updateDirection(DIRECTION.UP);
        } else if (controls.isDownDown) {
            this.updateVelocity(false, 1);
            this.updateDirection(DIRECTION.DOWN);
        } else {
            this.updateVelocity(false, 0);
        }

        const isMovingVertically = controls.isUpDown || controls.isDownDown;
        if (controls.isLeftDown) {
            this._gameObject.setFlipX(true);
            this.updateVelocity(true, -1);

            //to hanlde animation when moving sideways
            if (!isMovingVertically) {
                this.updateDirection(DIRECTION.LEFT);
            }
        } else if (controls.isRightDown) {
            this._gameObject.setFlipX(false);
            this.updateVelocity(true, 1);

            if (!isMovingVertically) {
                this.updateDirection(DIRECTION.RIGHT);
            }
        } else {
            this.updateVelocity(true, 0);
        }

        this.normalizeVelocity();
    }
    private updateDirection(direction: Direction): void {
        this._gameObject.direction = direction;
        this._gameObject.animationComponent.playAnimation(
            `WALK_${this._gameObject.direction}`
        );
    }
}
