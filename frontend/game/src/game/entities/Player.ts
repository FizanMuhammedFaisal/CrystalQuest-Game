import Phaser, { Scene } from "phaser";

import { InputComponent } from "../components/input/inputComponent";
import { IdleState } from "../components/statemachine/states/character/idleState";
import { CHARACTER_STATES } from "../components/statemachine/states/character/characterStates";
import { MoveState } from "../components/statemachine/states/character/moveState";
import { AnimationConfig } from "../components/gameobject/animationComponent";
import { ASSET_KEYS, PLAYER_ANIMATION_KEYS } from "../../common/assets";
import { CharactrerGameObject } from "../components/gameobject/common/characterGameObject";
import {
    PLAYER_ATTACK_DAMAGE,
    PLAYER_HURT_PUSH_BACK_SPEED,
    PLAYER_INVULNARABLE_AFTER_HIT_ANIMATION_DURATION,
    PLAYER_SPEED,
} from "../../config";
import { HurtState } from "../components/statemachine/states/character/hurtState";
import { State } from "../components/statemachine/statemachine";
import { DeathState } from "../components/statemachine/states/character/deathState";
import { AttackState } from "../components/statemachine/states/character/attackState";
import { Weapon } from "../components/gameobject/weapon/baseWeapon";
import { WeaponComponent } from "../components/gameobject/weaponComponent";
import { Sword } from "../components/gameobject/weapon/sword";
type TPlayer = {
    scene: Scene;
    positions: { x: number; y: number };
    controls: InputComponent;
    maxLife: number;
    currentLife?: number;
};
export class Player extends CharactrerGameObject {
    private weaponComponent: Weapon;
    constructor(config: TPlayer) {
        const animationConfig: AnimationConfig = {
            WALK_DOWN: {
                key: PLAYER_ANIMATION_KEYS.WALK_DOWN,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_UP: {
                key: PLAYER_ANIMATION_KEYS.WALK_UP,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_LEFT: {
                key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.WALK_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_DOWN: {
                key: PLAYER_ANIMATION_KEYS.IDLE_DOWN,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_UP: {
                key: PLAYER_ANIMATION_KEYS.IDLE_UP,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_LEFT: {
                key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.IDLE_SIDE,
                repeat: -1,
                ignoreIfPlaying: true,
            },

            HURT_DOWN: {
                key: PLAYER_ANIMATION_KEYS.HURT_DOWN,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            HURT_UP: {
                key: PLAYER_ANIMATION_KEYS.HURT_UP,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            HURT_LEFT: {
                key: PLAYER_ANIMATION_KEYS.HURT_SIDE,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            HURT_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.HURT_SIDE,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_DOWN: {
                key: PLAYER_ANIMATION_KEYS.DIE_DOWN,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_UP: {
                key: PLAYER_ANIMATION_KEYS.DIE_UP,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_LEFT: {
                key: PLAYER_ANIMATION_KEYS.DIE_SIDE,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_RIGHT: {
                key: PLAYER_ANIMATION_KEYS.DIE_SIDE,
                repeat: 0,
                ignoreIfPlaying: true,
            },
        };
        super({
            scene: config.scene,
            positions: config.positions,
            assetKey: ASSET_KEYS.PLAYER,
            inputComponent: config.controls,
            animationConfig,
            speed: PLAYER_SPEED,
            id: "player",
            isPlayer: true,
            isInvulnarable: false,
            invulnarableAfterHitAnimtionDuration:
                PLAYER_INVULNARABLE_AFTER_HIT_ANIMATION_DURATION,
            maxLife: config.maxLife,
            currentLife: config.currentLife,
        });

        this.setCollideWorldBounds(true);

        this.weaponComponent = new WeaponComponent(this);
        this.weaponComponent.weapon = new Sword(
            this,
            this.weaponComponent,
            {
                DOWN: PLAYER_ANIMATION_KEYS.SWORD_1_ATTACK_DOWN,
                UP: PLAYER_ANIMATION_KEYS.SWORD_1_ATTACK_UP,
                LEFT: PLAYER_ANIMATION_KEYS.SWORD_1_ATTACK_SIDE,
                RIGHT: PLAYER_ANIMATION_KEYS.SWORD_1_ATTACK_SIDE,
            },
            PLAYER_ATTACK_DAMAGE
        );
        this._stateMachine.addState(new IdleState(this));
        this._stateMachine.addState(new MoveState(this));
        this._stateMachine.addState(
            new HurtState(this, PLAYER_HURT_PUSH_BACK_SPEED, () => {
                console.log("hurt");
            }) as State
        );
        this._stateMachine.addState(new AttackState(this));

        this._stateMachine.addState(new DeathState(this));
        this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

        config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            config.scene.events.off(
                Phaser.Scenes.Events.UPDATE,
                this.update,
                this
            );
        });

        this.physicsBody
            .setSize(12, 16, true)
            .setOffset(this.width / 2 - 5, this.height / 2);
    }

    get physicsBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }
    get weaponCompoent(): WeaponComponent {
        return this.weaponComponent;
    }
    public update(): void {
        this.weaponComponent.update();
        super.update();
    }
}
