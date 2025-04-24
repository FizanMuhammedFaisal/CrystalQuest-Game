import CONFIG from "../config";
import { assets } from "./index";

export function getAssetUrl(assetPath: string) {
    return `${CONFIG.baseUrl}${CONFIG.assetsPath}/${assetPath}`;
}

export function loadGameAssets(scene: Phaser.Scene) {
    // Load tilemap
    scene.load.tilemapTiledJSON("game-map", assets.tilemaps.GameMap);

    // Load tilesets - using getAssetUrl
    scene.load.image("Tiles", getAssetUrl("Tiles.png"));
    scene.load.image("Trees", getAssetUrl("trees.png"));
    scene.load.image("CollisionTiles", getAssetUrl("CollisionTiles.png"));
    scene.load.image("WoodWalls", getAssetUrl("WoodWalls.png"));

    // Load spritesheets - using getAssetUrl
    scene.load.spritesheet("Crystal", getAssetUrl("crystal.png"), {
        frameWidth: 32,
        frameHeight: 32,
    });
    scene.load.spritesheet("FountainStone", getAssetUrl("FountainStone.png"), {
        frameWidth: 32,
        frameHeight: 32,
    });
    scene.load.spritesheet("Player", getAssetUrl("Player.png"), {
        frameWidth: 32.25,
        frameHeight: 68,
    });
    scene.load.aseprite(
        "player-idle",

        "/src/assets/sprites/Sprite-0020.png",
        "/src/assets/sprites/Sprite-0020.json"
    );
}
