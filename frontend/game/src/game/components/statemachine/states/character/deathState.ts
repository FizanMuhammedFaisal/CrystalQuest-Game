import { CHARACTER_ANIMATIONS } from "../../../../../common/assets";
import { CharactrerGameObject } from "../../../gameobject/common/characterGameObject";
import { BaseCharacterState } from "./baseChacacterState";
import { CHARACTER_STATES } from "./characterStates";

export class DeathState extends BaseCharacterState {
    private onDieCallback: () => void;
    constructor(
        gameObject: CharactrerGameObject,
        onDieCallback: () => void = () => undefined
    ) {
        super(CHARACTER_STATES.DEATH_STATE, gameObject);
        this.onDieCallback = onDieCallback;
    }
    public onEnter(): void {
        this._gameObject.body.velocity.x = 0;
        this._gameObject.body.velocity.y = 0;

        this._gameObject.invalueableComponent.invulnarable = true;
        (this._gameObject.body as Phaser.Physics.Arcade.Body).enable = false;
        this._gameObject.animationComponent.playAnimation(
            CHARACTER_ANIMATIONS.DIE_DOWN,
            () => {
                this.triggerDefeatedEvent();
            }
        );
    }
    private triggerDefeatedEvent() {
        this._gameObject.disableBody();
        this.onDieCallback();
    }
}
