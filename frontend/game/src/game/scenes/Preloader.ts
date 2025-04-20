import { Scene } from "phaser";
import { loadGameAssets } from "../../assets/gameAssets";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        loadGameAssets(this);
    }

    create() {
        this.anims.create({
            key: "crystal-spin",
            frames: this.anims.generateFrameNumbers("Crystal", {
                start: 0,
                end: 6,
            }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: "fountainStone-glow",
            frames: this.anims.generateFrameNumbers("FountainStone", {
                start: 0,
                end: 2,
            }),
            frameRate: 8,
            repeat: -1,
        });
        this.scene.start("Game");
        this.cameras.main.fadeOut(100, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Game");
        });
    }
}
