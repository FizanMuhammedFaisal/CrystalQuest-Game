import { Direction } from "../../../types/types";
import { WeaponComponent } from "../weaponComponent";

export interface Weapon {
    baseDamage: number;
    isAttacking: boolean;
    attackUp(): void;
    attackDown(): void;
    attackLeft(): void;
    attackRight(): void;
    update(): void;
    onCollitionCallback(): void;
}

export type WeaponAttackAnimationConfig = {
    [key in Direction]: string;
};
export abstract class BaseWeapon implements Weapon {
    protected _weaponComponent: WeaponComponent;
    protected _attacking: boolean;
    protected _baseDamage: number;
    protected _sprite: Phaser.GameObjects.Sprite;
    protected _attackAnimationConfig: WeaponAttackAnimationConfig;
    constructor(
        sprite: Phaser.GameObjects.Sprite,
        weaponComponent: WeaponComponent,
        animationConfig: WeaponAttackAnimationConfig,
        baseDamage: number
    ) {
        this._sprite = sprite;
        this._weaponComponent = weaponComponent;
        this._attackAnimationConfig = animationConfig;
        this._baseDamage = baseDamage;
        this._attacking = false;
    }
    get isAttacking(): boolean {
        return this._attacking;
    }
    get baseDamage(): number {
        return this._baseDamage;
    }
    public abstract attackUp(): void;
    public abstract attackDown(): void;
    public abstract attackLeft(): void;
    public abstract attackRight(): void;
    public update(): void {
        //not implemented
    }
    public onCollitionCallback(): void {
        //not implemented
    }
    protected attack(direction: Direction): void {
        const attackKeyAnimation = this._attackAnimationConfig[direction];
        this._attacking = true;
        this._sprite.anims.play(
            {
                key: attackKeyAnimation,
                repeat: 0,
            },
            true
        );
        this._weaponComponent.body.enable = true;
        this._sprite.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
                attackKeyAnimation,
            () => {
                this.attackAnimationCompleteHanlder();
            }
        );
    }
    protected attackAnimationCompleteHanlder(): void {
        this._attacking = false;
        this._weaponComponent.body.enable = false;
    }
}
