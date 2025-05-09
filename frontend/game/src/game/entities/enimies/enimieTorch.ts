import Phaser from "phaser";

import { InputComponent } from "../../components/input/inputComponent";
import { CharactrerGameObject } from "../../components/gameobject/common/characterGameObject";
import { AnimationConfig } from "../../components/gameobject/animationComponent";
import {
    ASSET_KEYS,
    ENIMIE_TORCH_ANIMATION_KEYS,
} from "../../../common/assets";
import {
    ENIMIE_TORCH_DAMAGE,
    TORCH_ENIMIE_HURT_PUSH_BACK_SPEED,
    TORCH_ENIMIE_SPEED,
    TORCH_ENIMIE_START_MAX_HEALTH,
    TORCH_ENIMIE_ATTACK_RANGE,
    TORCH_ENIMIE_ATTACK_COOLDOWN,
    TORCH_ENIMIE_DETECTION_RADIUS,
    TORCH_ENIMIE_RETURN_THRESHOLD,
} from "../../../config";
import { IdleState } from "../../components/statemachine/states/character/idleState";
import { MoveState } from "../../components/statemachine/states/character/moveState";
import { CHARACTER_STATES } from "../../components/statemachine/states/character/characterStates";
import { HurtState } from "../../components/statemachine/states/character/hurtState";
import { State } from "../../components/statemachine/statemachine";
import { DeathState } from "../../components/statemachine/states/character/deathState";
import { AttackState } from "../../components/statemachine/states/character/attackState";
import { WeaponComponent } from "../../components/gameobject/weaponComponent";
import { Torch } from "../../components/gameobject/weapon/torch";

// AI states for more readable state management
enum AI_STATE {
    IDLE,
    CHASE,
    RETURN,
    ATTACK,
    PATROL, // New patrol state for more varied behavior
}

type TEnimie = {
    scene: Phaser.Scene;
    positions: { x: number; y: number };
    player?: Phaser.GameObjects.Sprite;
    patrolPoints?: { x: number; y: number }[]; // Optional patrol points
};

export class EnimieTorch extends CharactrerGameObject {
    private detectionRadius: number = TORCH_ENIMIE_DETECTION_RADIUS || 150;
    private attackRange: number = TORCH_ENIMIE_ATTACK_RANGE || 60;
    private _scene: Phaser.Scene;
    private weaponComponent: WeaponComponent;
    private initialPosition: { x: number; y: number };
    private player: Phaser.GameObjects.Sprite | null = null;
    private aiState: AI_STATE = AI_STATE.IDLE;
    private lastAttackTime: number = 0;
    private lastStateChangeTime: number = 0;
    private patrolPoints: { x: number; y: number }[] = [];
    private currentPatrolIndex: number = 0;
    private patrolWaitTime: number = 5000;
    private sightLine: Phaser.Geom.Line = new Phaser.Geom.Line(0, 0, 0, 0);
    private playerWasVisible: boolean = false;
    private lastKnownPlayerPosition: { x: number; y: number } | null = null;
    private stateBeforeAttack: AI_STATE = AI_STATE.IDLE;

    constructor(config: TEnimie) {
        const { scene } = config;
        const animationConfig: AnimationConfig = {
            // Animation config remains unchanged
            WALK_DOWN: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.WALK_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_UP: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.WALK_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_LEFT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.WALK_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            WALK_RIGHT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.WALK_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_DOWN: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.IDLE_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_UP: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.IDLE_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_LEFT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.IDLE_LEFT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            IDLE_RIGHT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.IDLE_RIGHT,
                repeat: -1,
                ignoreIfPlaying: true,
            },
            HURT_DOWN: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.HURT_DOWN,
                repeat: 0,
                ignoreIfPlaying: false,
            },
            HURT_UP: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.HURT_UP,
                repeat: 0,
                ignoreIfPlaying: false,
            },
            HURT_LEFT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.HURT_LEFT,
                repeat: 0,
                ignoreIfPlaying: false,
            },
            HURT_RIGHT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.HURT_RIGHT,
                repeat: 0,
                ignoreIfPlaying: false,
            },
            DIE_DOWN: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.DIE_DOWN,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_UP: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.DIE_UP,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_LEFT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.DIE_LEFT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
            DIE_RIGHT: {
                key: ENIMIE_TORCH_ANIMATION_KEYS.DIE_RIGHT,
                repeat: 0,
                ignoreIfPlaying: true,
            },
        };

        // Create a new InputComponent for the enemy
        const inputComponent = new InputComponent();

        super({
            scene: config.scene,
            positions: config.positions,
            assetKey: ASSET_KEYS.TORCH_ENIMIE,
            inputComponent: inputComponent,
            animationConfig,
            speed: TORCH_ENIMIE_SPEED,
            id: `enimie_torch${Phaser.Math.RND.uuid()}`,
            isPlayer: false,
            isInvulnarable: false,
            maxLife: TORCH_ENIMIE_START_MAX_HEALTH,
        });

        this._scene = scene;

        this.initialPosition = { x: config.positions.x, y: config.positions.y };

        if (config.patrolPoints && config.patrolPoints.length > 0) {
            this.patrolPoints = config.patrolPoints;
        } else {
            const patrolRadius = 50;
            this.patrolPoints = [
                {
                    x: this.initialPosition.x - patrolRadius,
                    y: this.initialPosition.y,
                },
                {
                    x: this.initialPosition.x,
                    y: this.initialPosition.y - patrolRadius,
                },
                {
                    x: this.initialPosition.x + patrolRadius,
                    y: this.initialPosition.y,
                },
                {
                    x: this.initialPosition.x,
                    y: this.initialPosition.y + patrolRadius,
                },
            ];
        }

        this.weaponComponent = new WeaponComponent(this);
        this.weaponComponent.weapon = new Torch(
            this,
            this.weaponComponent,
            {
                DOWN: ENIMIE_TORCH_ANIMATION_KEYS.ATTACK_DOWN,
                UP: ENIMIE_TORCH_ANIMATION_KEYS.ATTACK_UP,
                LEFT: ENIMIE_TORCH_ANIMATION_KEYS.ATTACK_LEFT,
                RIGHT: ENIMIE_TORCH_ANIMATION_KEYS.ATTACK_RIGHT,
            },
            ENIMIE_TORCH_DAMAGE
        );

        this._stateMachine.addState(new IdleState(this));
        this._stateMachine.addState(new MoveState(this));
        this._stateMachine.addState(new AttackState(this));
        this._stateMachine.addState(
            new HurtState(this, TORCH_ENIMIE_HURT_PUSH_BACK_SPEED, () => {
                this.onHurt();
            }) as State
        );
        this._stateMachine.addState(
            new DeathState(this, () => {
                this.visible = false;
            })
        );
        this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

        this.setDepth(20);

        this.physicsBody
            .setSize(55, 63, true)
            .setOffset(this.width / 2 - 33, this.height / 2 - 28);

        if (this.showDebug) {
            this.debugGraphics = this.scene.add.graphics();
        }

        this.findPlayer();

        this.scene.time.delayedCall(500, () => {
            this.changeAIState(AI_STATE.PATROL);
        });
    }

    get physicsBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    public update(): void {
        this.updateAI();
        super.update();
    }

    private findPlayer(): void {
        if (!this.player) {
            this.player = this._scene.children
                .getChildren()
                .find(
                    (child): child is CharactrerGameObject =>
                        "id" in child && child.id === "player"
                ) as Phaser.GameObjects.Sprite;
        }
    }

    private onHurt(): void {
        // Visual effect for being hurt
        const originalAlpha = this.alpha;
        this.setTint(0xffffff);
        this.setBlendMode(Phaser.BlendModes.ADD);

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1.5, to: 0.8, yoyo: true },
            duration: 80,
            repeat: 2,
            onComplete: () => {
                this.clearTint();
                this.setBlendMode(Phaser.BlendModes.NORMAL);
                this.setAlpha(originalAlpha);
            },
        });
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");
        console.log("boss hurt");

        if (this.player) {
            this.lastKnownPlayerPosition = {
                x: this.player.x,
                y: this.player.y,
            };
            this.changeAIState(AI_STATE.CHASE);
        }
    }

    private updateAI(): void {
        if (!this.player) {
            this.findPlayer();
            return;
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        this.sightLine.setTo(this.x, this.y, this.player.x, this.player.y);

        // Check if player is within attack range and we can attack
        if (distanceToPlayer <= this.attackRange && this.canAttack()) {
            this.stateBeforeAttack = this.aiState;
            this.changeAIState(AI_STATE.ATTACK);
            this.performAttack();
            return;
        }

        // Handle different AI states
        switch (this.aiState) {
            case AI_STATE.IDLE:
                this.handleIdleState();
                break;

            case AI_STATE.PATROL:
                this.handlePatrolState();
                break;

            case AI_STATE.CHASE:
                this.handleChaseState(distanceToPlayer);
                break;

            case AI_STATE.RETURN:
                this.handleReturnState();
                break;

            case AI_STATE.ATTACK:
                // If attack animation is finished, return to previous state
                if (this.scene.time.now - this.lastAttackTime > 500) {
                    this.changeAIState(this.stateBeforeAttack);
                }
                break;
        }
    }

    private handleIdleState(): void {
        const canSeePlayer = this.checkLineOfSight();

        if (canSeePlayer) {
            this.changeAIState(AI_STATE.CHASE);
            return;
        }

        // Randomly switch to patrol state
        if (this.shouldChangeState() && Math.random() < 0.05) {
            this.changeAIState(AI_STATE.PATROL);
        }
    }

    private handlePatrolState(): void {
        // Check if we can see the player during patrol
        const canSeePlayer = this.checkLineOfSight();
        if (canSeePlayer) {
            this.changeAIState(AI_STATE.CHASE);
            return;
        }

        // Move towards current patrol point
        const currentPoint = this.patrolPoints[this.currentPatrolIndex];
        const distanceToPoint = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            currentPoint.x,
            currentPoint.y
        );

        // If we've reached the current patrol point
        if (distanceToPoint < 10) {
            // Wait at the patrol point before moving to next one
            if (
                this.scene.time.now - this.lastStateChangeTime >
                this.patrolWaitTime
            ) {
                // Move to next patrol point
                this.currentPatrolIndex =
                    (this.currentPatrolIndex + 1) % this.patrolPoints.length;
                this.lastStateChangeTime = this.scene.time.now;
            } else {
                // Just stand still while waiting
                this.controls.reset();
                return;
            }
        }

        // Move towards the current patrol point
        this.moveTowards(currentPoint.x, currentPoint.y);
    }

    private handleChaseState(distanceToPlayer: number): void {
        // Update last known position of player
        this.lastKnownPlayerPosition = { x: this.player!.x, y: this.player!.y };

        // If player is outside detection radius, start return behavior
        if (distanceToPlayer > this.detectionRadius) {
            this.changeAIState(AI_STATE.RETURN);
            return;
        }

        // Move towards player
        this.moveTowards(this.player!.x, this.player!.y);
    }

    private handleReturnState(): void {
        // Calculate distance to home position
        const distanceToHome = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.initialPosition.x,
            this.initialPosition.y
        );

        // Check if we should resume chase if player is visible again
        const canSeePlayer = this.checkLineOfSight();
        if (canSeePlayer) {
            this.changeAIState(AI_STATE.CHASE);
            return;
        }

        // If reached home, switch to patrol or idle
        if (distanceToHome < 10) {
            this.changeAIState(
                Math.random() < 0.5 ? AI_STATE.IDLE : AI_STATE.PATROL
            );
            return;
        }

        // Move towards home position
        this.moveTowards(this.initialPosition.x, this.initialPosition.y);
    }

    private moveTowards(targetX: number, targetY: number): void {
        // Calculate direction vector
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // Get direction angle
        const angle = Math.atan2(dy, dx);

        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);

        // Set the input controls based on the direction
        this.controls.isRightDown = dirX > 0.3;
        this.controls.isLeftDown = dirX < -0.3;
        this.controls.isDownDown = dirY > 0.3;
        this.controls.isUpDown = dirY < -0.3;
    }

    private canAttack(): boolean {
        const currentTime = this.scene.time.now;
        return (
            currentTime - this.lastAttackTime >= TORCH_ENIMIE_ATTACK_COOLDOWN
        );
    }

    private performAttack(): void {
        // Set direction for attack based on player position
        if (!this.player) return;

        // Reset the attack cooldown
        this.lastAttackTime = this.scene.time.now;

        // Set the attack state
        this._stateMachine.setState(CHARACTER_STATES.ATTACK_STATE);
    }

    private changeAIState(newState: AI_STATE): void {
        // Don't change to the same state
        if (this.aiState === newState) return;

        // Record state change time for state-specific timing logic
        this.lastStateChangeTime = this.scene.time.now;
        this.aiState = newState;

        // Reset controls when changing state
        this.controls.reset();
    }

    private shouldChangeState(): boolean {
        // Only allow state changes after a minimum time to prevent rapid switching
        return this.scene.time.now - this.lastStateChangeTime > 1000;
    }

    private checkLineOfSight(): boolean {
        if (!this.player) return false;

        // Check if player is within detection radius
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        if (distanceToPlayer > this.detectionRadius) {
            return false;
        }

        // Simple line of sight implementation
        // For more complex games, you might want to check against walls/obstacles
        return true;
    }
}
