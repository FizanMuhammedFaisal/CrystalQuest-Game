import { GameObject } from "../../types/types";

import { BaseGameobjectComponent } from "./baseGameobjectComponent";
export class LifeComponent extends BaseGameobjectComponent {
    #maxLife: number;
    #currentLife: number;
    constructor(
        gameObject: GameObject,
        maxLife: number,
        currentLife = maxLife
    ) {
        super(gameObject);
        this.#maxLife = maxLife;
        this.#currentLife = currentLife;
    }
    get life(): number {
        return this.#currentLife;
    }
    get maxLife(): number {
        return this.#maxLife;
    }
    public takeDamage(damage: number): void {
        if (this.#currentLife === 0) {
            return;
        }
        this.#currentLife -= damage;
        if (this.#currentLife <= 0) {
            this.#currentLife = 0;
        }
    }
}
