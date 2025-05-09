import { Scene } from "phaser";
import {
    ASSET_KEYS,
    HEART_ANIMATIONS,
    HEART_TEXTURE_FRAME,
} from "../../common/assets";
import { DataManager } from "../../common/dataManager";
import {
    CUSTOM_EVENTS,
    EVENT_BUS,
    PLAYER_HEALTH_UPDATE_TYPE,
    PlayerHealthUpdated,
} from "../../common/eventbus";
import { DEFAULT_UI_TEXT_STYLE } from "../../common/common";

export class UIScene extends Scene {
    private hudContainer!: Phaser.GameObjects.Container;
    private hearts!: Phaser.GameObjects.Sprite[];
    private dialogContainer!: Phaser.GameObjects.Container;
    private dialogContainerText!: Phaser.GameObjects.Text;
    constructor() {
        super("UIScene");
    }

    // init() {}

    // preload() {}

    create() {
        this.hudContainer = this.add.container(0, 0, []);
        this.hearts = [];
        const numberOfHearts = Math.floor(
            DataManager.instance.playerData.maxHealth / 2
        );
        const numberOfFullHearts = Math.floor(
            DataManager.instance.playerData.currentHealth / 2
        );
        const hasHalfHeart = DataManager.instance.playerData.currentHealth % 2;
        for (let i = 0; i < 20; i++) {
            let x = 40 + 33 * i;
            let y = 35;
            if (i >= 10) {
                x = 40 + 33 * (i - 10);
                y = 70;
            }
            let frame: string = HEART_TEXTURE_FRAME.NONE;
            if (i < numberOfFullHearts) {
                frame = HEART_TEXTURE_FRAME.FULL;
            } else if (i < numberOfHearts) {
                frame = HEART_TEXTURE_FRAME.EMPTY;
            }
            if (hasHalfHeart && i === numberOfFullHearts) {
                frame = HEART_TEXTURE_FRAME.HALF;
            }
            this.hearts.push(
                this.add
                    .sprite(x, y, ASSET_KEYS.HUD_NUMBERS, frame)
                    .setOrigin(0)
                    .setScale(4)
            );
        }
        this.hudContainer.add(this.hearts);
        this.dialogContainer = this.add.container(
            window.innerWidth / 2,
            window.innerHeight - 100,
            this.add.image(0, 0, ASSET_KEYS.UI_DIALOG, 0).setOrigin(0)
        );
        this.dialogContainerText = this.add
            .text(14, 14, "", DEFAULT_UI_TEXT_STYLE)
            .setOrigin(0);
        this.dialogContainer.add(this.dialogContainerText);
        this.dialogContainer.visible = false;
        EVENT_BUS.on(CUSTOM_EVENTS.SHOW_DIALOG, this.showDialog, this);
        EVENT_BUS.on(
            CUSTOM_EVENTS.PLAYER_HEALTH_UPDATED,
            this.updateHealthInHud,
            this
        );
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            EVENT_BUS.off(
                CUSTOM_EVENTS.PLAYER_HEALTH_UPDATED,
                this.updateHealthInHud,
                this
            );
            EVENT_BUS.off(CUSTOM_EVENTS.SHOW_DIALOG, this.showDialog, this);
        });
    }
    private updateHealthInHud(data: PlayerHealthUpdated): void {
        if (data.type === PLAYER_HEALTH_UPDATE_TYPE.INCREASE) {
            return;
        }
        const healthDifference = data.previousHealth - data.currentHealth;
        let health = data.previousHealth;
        for (let i = 0; i < healthDifference; i++) {
            const heartIndex = Math.round(health / 2) - 1;
            const isHalfHeart = health % 2 === 1;
            let animationName = HEART_ANIMATIONS.LOSE_LAST_HALF;
            if (!isHalfHeart) {
                animationName = HEART_ANIMATIONS.LOSE_FIRST_HALF;
            }
            this.hearts[heartIndex].play(animationName);
            // await new Promise((resolve) => {

            //     this.hearts[heartIndex].once(
            //         Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
            //             animationName,
            //         () => {
            //             resolve(undefined);
            //         }
            //     );
            // });
            health--;
        }
    }
    public showDialog(message: string): void {
        this.dialogContainerText.setText(message);
        this.dialogContainer.visible = true;
        this.time.delayedCall(3000, () => {
            this.dialogContainer.visible = false;
            EVENT_BUS.emit(CUSTOM_EVENTS.HIDE_DIALOG);
        });
    }
}
