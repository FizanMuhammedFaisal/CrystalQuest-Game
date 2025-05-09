import { Scene } from "phaser";
import { ASSET_KEYS } from "../../common/assets";
import { KeyboardComponent } from "../components/input/keyboardComponent";
import { DEFAULT_UI_TEXT_STYLE } from "../../common/common";
import { DataManager } from "../../common/dataManager";

export class GameOver extends Scene {
    private menuContainer!: Phaser.GameObjects.Container;
    private cursorGameObject!: Phaser.GameObjects.Image;
    private controls!: KeyboardComponent;
    private selectedMenuOptionIndex!: number;
    constructor() {
        super("GameOver");
    }

    // init() {}

    // preload() {}

    create() {
        if (!this.input.keyboard) {
            return;
        }
        this.add
            .text(this.scale.width / 2, 100, "Game Over", DEFAULT_UI_TEXT_STYLE)
            .setOrigin(0.5);

        this.menuContainer = this.add.container(32, 142, [
            this.add.image(0, 0, ASSET_KEYS.UI_DIALOG, 0).setOrigin(0),
            this.add
                .text(32, 16, "Continue", DEFAULT_UI_TEXT_STYLE)
                .setOrigin(0),
            this.add.text(32, 32, "Quit", DEFAULT_UI_TEXT_STYLE).setOrigin(0),
        ]);
        this.cursorGameObject = this.add
            .image(20, 14, ASSET_KEYS.UI_CURSOR, 0)
            .setOrigin(0);

        this.menuContainer.add(this.cursorGameObject);
        this.controls = new KeyboardComponent(this.input.keyboard);

        this.selectedMenuOptionIndex = 0;
        DataManager.instance.resetPlayerHealthToMin();
    }
    public update(): void {
        if (
            this.controls.isActionKeyJustDown ||
            this.controls.isEnterKeyJustDown ||
            this.controls.isSelectKeyJustDown
        ) {
            if (this.selectedMenuOptionIndex === 1) {
                window.location.reload();
                return;
            } else {
                this.scene.start("Game");
            }

            return;
        }

        if (this.controls.isUpDown) {
            this.selectedMenuOptionIndex -= 1;
            if (this.selectedMenuOptionIndex < 0) {
                this.selectedMenuOptionIndex = 0;
            }
        } else if (this.controls.isDownDown) {
            this.selectedMenuOptionIndex += 1;
            if (this.selectedMenuOptionIndex > 1) {
                this.selectedMenuOptionIndex = 1;
            }
        } else {
            return;
        }
        this.cursorGameObject.setY(14 + this.selectedMenuOptionIndex * 16);
    }
}
