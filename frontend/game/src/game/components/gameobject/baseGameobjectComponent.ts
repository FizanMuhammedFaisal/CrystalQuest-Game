//example:player,enimie stufs

import * as Phaser from "phaser";
import { GameObject } from "../../types/types";

export class BaseGameobjectComponent {
    protected scene: Phaser.Scene;
    protected gameObject: GameObject;

    constructor(gameObject: GameObject) {
        this.scene = gameObject.scene as unknown as Phaser.Scene;
        this.gameObject = gameObject;
        this.assignComponentToObject(gameObject);
    }
    //genius pattern so a component inheriting this callled health
    // when a object is passed to this health class the object will have a
    // health's refecne with name "health"
    protected assignComponentToObject(
        object: GameObject | Phaser.Physics.Arcade.Body
    ): void {
        object[`_${this.constructor.name}`] = this;
    }
    //getting the setted value
    static getComponent<T>(gameObject: GameObject): T {
        return gameObject[`_${this.name}`] as T;
    }
    //removing the setted value
    static remoteComponent(gameObject: GameObject): void {
        delete gameObject[`_${this.name}`];
    }
}
