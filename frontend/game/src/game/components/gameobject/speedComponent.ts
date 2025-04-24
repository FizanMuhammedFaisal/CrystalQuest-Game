import { GameObject } from "../../types/types";

import { BaseGameobjectComponent } from "./baseGameobjectComponent";
//so here teh gameobject can be player for ex and
// here we add the ControlsComponent instalce to the player so we can
//access teh inputCompnet by it and we can swap this inputComponent to anything

export class SpeedsComponent extends BaseGameobjectComponent {
    _speed: number;
    constructor(gameObject: GameObject, speed: number) {
        super(gameObject);
        this._speed = speed;
    }
    get speed(): number {
        return this._speed;
    }
}
