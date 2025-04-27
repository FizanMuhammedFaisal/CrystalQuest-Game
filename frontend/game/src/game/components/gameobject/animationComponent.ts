import { CharacterAnimation, GameObject } from "../../types/types";

import { BaseGameobjectComponent } from "./baseGameobjectComponent";
export type AnimationConfig = {
    [key in CharacterAnimation]?: {
        key: string;
        repeat: number;
        ignoreIfPlaying?: boolean;
    };
};
export class AnimationComponent extends BaseGameobjectComponent {
    protected declare gameObject: Phaser.GameObjects.Sprite;
    private config: AnimationConfig;
    constructor(gameObject: GameObject, config: AnimationConfig) {
        super(gameObject);
        this.config = config;
    }
    public isAnimationPlaying(): boolean {
        return this.gameObject.anims.isPlaying;
    }
    public getAnimationKey(
        characterAnimatoin: CharacterAnimation
    ): string | undefined {
        if (this.config[characterAnimatoin] === undefined) {
            return undefined;
        }
        return this.config[characterAnimatoin].key;
    }
    public playAnimation(
        characterAnimationKey: CharacterAnimation,
        callback?: () => void
    ): void {
        if (!this.gameObject) {
            console.error("No gameObject found in AnimationComponent");
            return;
        }

        if (!this.config) {
            console.error("No animation config found");
            return;
        }

        if (this.config[characterAnimationKey] === undefined) {
            console.error(
                `No animation config found for key: ${characterAnimationKey}`
            );
            if (callback) {
                callback();
            }
            return;
        }
        const animationConfig: Phaser.Types.Animations.PlayAnimationConfig = {
            key: this.config[characterAnimationKey].key,
            repeat: this.config[characterAnimationKey].repeat,
            timeScale: 1,
        };
        if (callback) {
            const animationKey =
                Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
                this.config[characterAnimationKey].key;
            this.gameObject.once(animationKey, () => {
                callback();
            });
        }
        this.gameObject.play(
            animationConfig,
            this.config[characterAnimationKey].ignoreIfPlaying
        );
    }
}
