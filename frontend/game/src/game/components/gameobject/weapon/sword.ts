import { DIRECTION } from "../../../../common/common";
import { BaseWeapon } from "./baseWeapon";

export class Sword extends BaseWeapon {
    public attackUp(): void {
        this.attack(DIRECTION.UP);
    }
    public attackDown(): void {
        this.attack(DIRECTION.DOWN);
    }
    public attackLeft(): void {
        this.attack(DIRECTION.LEFT);
    }
    public attackRight(): void {
        this.attack(DIRECTION.RIGHT);
    }
}
