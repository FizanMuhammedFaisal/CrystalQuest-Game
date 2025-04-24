import { GameObject } from "../../types/types";
import { InputComponent } from "../input/inputComponent";
import { BaseGameobjectComponent } from "./baseGameobjectComponent";
//so here teh gameobject can be player for ex and
// here we add the ControlsComponent instalce to the player so we can
//access teh inputCompnet by it and we can swap this inputComponent to anything

export class ControlsComponent extends BaseGameobjectComponent {
    private inputComponent: InputComponent;
    constructor(gameObject: GameObject, inputComponent: InputComponent) {
        super(gameObject);
        this.inputComponent = inputComponent;
    }
    get controls(): InputComponent {
        return this.inputComponent;
    }
}
