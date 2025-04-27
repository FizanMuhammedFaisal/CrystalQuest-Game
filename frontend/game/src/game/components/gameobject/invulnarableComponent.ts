import { GameObject } from "../../types/types";

import { BaseGameobjectComponent } from "./baseGameobjectComponent";

export class InvulnarableComponent extends BaseGameobjectComponent {
    private _invulnarable: boolean;
    private _invulnarableAfterHitAnimtionDuration: number;
    constructor(
        gameObject: GameObject,
        invulnarable = false,
        invulnarableAfterHitAnimtionDuration = 0
    ) {
        super(gameObject);
        this._invulnarable = invulnarable;
        this._invulnarableAfterHitAnimtionDuration =
            invulnarableAfterHitAnimtionDuration;
    }
    get invulnarable(): boolean {
        return this._invulnarable;
    }
    set invulnarable(value: boolean) {
        this._invulnarable = value;
    }
    get invulnarableAfterHitAnimtionDuration(): number {
        return this._invulnarableAfterHitAnimtionDuration;
    }
    set invulnarableAfterHitAnimtionDuration(value: number) {
        this._invulnarableAfterHitAnimtionDuration = value;
    }
}
