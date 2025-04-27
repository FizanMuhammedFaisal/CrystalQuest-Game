import { Scene } from "phaser";

import { ASSET_PACK_KEYS, ASSET_KEYS } from "../../common/assets";
import { LevelData } from "../types/types";
import { LEVEL_NAME } from "../../common/common";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {}

    preload() {
        // this.load.glsl(
        //     "dayNightShader",
        //     "/src/game/shaders/dayNightShader.frag"
        // );
        this.load.pack(ASSET_PACK_KEYS.MAIN, "/src/assets/data/assets.json");
    }

    create() {
        //TODO
        const sceneData: LevelData = {
            level: LEVEL_NAME.GROUND,
            passageId: 1,
            areaId: 1,
        };
        this.anims.createFromAseprite(ASSET_KEYS.PLAYER);
        this.anims.createFromAseprite(ASSET_KEYS.ENIMIE_SLIME);

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
        this.scene.start("Game", sceneData);
        // this.input.keyboard.once("keydown-SPACE", () => {
        this.physics.world.createDebugGraphic();
        // });
    }
}
