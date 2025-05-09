import { DIRECTION } from "../../../../common/common";
import { BaseWeapon } from "./baseWeapon";

export class Torch extends BaseWeapon {
    public attackUp(): void {
        this.attack(DIRECTION.UP);
        this._sprite.scene.time.delayedCall(150, () => {
            this._weaponComponent.body?.setSize(100, 50);
            this._weaponComponent.body?.position.set(
                this._sprite.x - 35,
                this._sprite.y - 45
            );
        });
    }
    public attackDown(): void {
        this.attack(DIRECTION.DOWN);
        this._sprite.scene.time.delayedCall(150, () => {
            this._weaponComponent.body?.setSize(100, 50);
            if (this._sprite.flipX) {
                this._weaponComponent.body?.position.set(
                    this._sprite.x - 50,
                    this._sprite.y + 10
                );
            } else {
                this._weaponComponent.body?.position.set(
                    this._sprite.x - 50,
                    this._sprite.y + 25
                );
            }
        });
    }
    public attackLeft(): void {
        this.attack(DIRECTION.LEFT);
        this._sprite.scene.time.delayedCall(150, () => {
            this._weaponComponent.body?.setSize(40, 60);
            this._weaponComponent.body?.position.set(
                this._sprite.x - 70,
                this._sprite.y - 30
            );
        });
    }
    public attackRight(): void {
        this.attack(DIRECTION.RIGHT);
        //make a delayed attack every time
        this._sprite.scene.time.delayedCall(150, () => {
            this._weaponComponent.body?.setSize(40, 60);
            this._weaponComponent.body?.position.set(
                this._sprite.x + 20,
                this._sprite.y - 20
            );
        });
    }
}
