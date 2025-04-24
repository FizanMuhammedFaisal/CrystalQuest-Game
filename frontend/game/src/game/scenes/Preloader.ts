import { Scene } from "phaser";
import { loadGameAssets } from "../../assets/gameAssets";
import { ASSET_PACK_KEYS, ASSET_KEYS } from "../../common/assets";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        this.load.pack(ASSET_PACK_KEYS.MAIN, "/src/assets/data/assets.json");
    }

    create() {
        this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
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

        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("Game");
        });
    }
}
