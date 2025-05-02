import { CharactrerGameObject } from "../../../gameobject/common/characterGameObject";
import { WeaponComponent } from "../../../gameobject/weaponComponent";
import { BaseCharacterState } from "./baseChacacterState";
import { CHARACTER_STATES } from "./characterStates";

export class AttackState extends BaseCharacterState {
    constructor(gameObject: CharactrerGameObject) {
        super(CHARACTER_STATES.ATTACK_STATE, gameObject);
    }
    public onEnter(): void {
        console.log("attackState");
        this._gameObject.body.velocity.x = 0;
        this._gameObject.body.velocity.y = 0;

        const weaponComponent = WeaponComponent.getComponent<WeaponComponent>(
            this._gameObject
        );
        if (
            weaponComponent === undefined ||
            weaponComponent.weapon === undefined
        ) {
            this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
            return;
        }
        const weapon = weaponComponent.weapon;
        switch (this._gameObject.direction) {
            case "DOWN": {
                weapon.attackDown();
                break;
            }
            case "UP": {
                weapon.attackUp();
                break;
            }
            case "LEFT": {
                weapon.attackLeft();
                break;
            }
            case "RIGHT": {
                weapon.attackRight();
                break;
            }
        }
    }
    onUpdate(): void {
        const weaponComponent = WeaponComponent.getComponent<WeaponComponent>(
            this._gameObject
        );
        if (
            weaponComponent === undefined ||
            weaponComponent.weapon === undefined
        ) {
            this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
            return;
        }
        const weapon = weaponComponent.weapon;
        if (weapon?.isAttacking) {
            return;
        }
        this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE);
    }
}
