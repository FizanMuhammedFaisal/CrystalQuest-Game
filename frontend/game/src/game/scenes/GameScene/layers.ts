import { Game } from "../Game";
import * as Keys from "../../../common";

export interface GameLayers {
    ground: Phaser.Tilemaps.TilemapLayer;
    world: Phaser.Tilemaps.TilemapLayer;
    overlay: Phaser.Tilemaps.TilemapLayer;
}

export function setupLayers(scene: Game): GameLayers {
    const tilesTileset = scene.tilemap.addTilesetImage("Tiles", "Tiles");
    const TreesTileset = scene.tilemap.addTilesetImage("trees", "Trees");
    const GroundSetTileset = scene.tilemap.addTilesetImage(
        "GroundSet",
        "GroundSet"
    );
    const WoodWallsTileset = scene.tilemap.addTilesetImage(
        "WoodWalls",
        "WoodWalls"
    );

    if (
        !TreesTileset ||
        !tilesTileset ||
        !WoodWallsTileset ||
        !GroundSetTileset
    ) {
        throw new Error("Failed to load tilesets");
    }

    const layers = {
        ground: scene.tilemap.createLayer("GroundLayer", [
            tilesTileset,
            GroundSetTileset,
        ])!,
        world: scene.tilemap.createLayer("WorldLayer", [
            tilesTileset,
            TreesTileset,
            WoodWallsTileset,
            GroundSetTileset,
        ])!,
        overlay: scene.tilemap.createLayer("OverlayLayer", [
            TreesTileset,
            WoodWallsTileset,
            GroundSetTileset,
        ])!,
        // collision: scene.tilemap.createLayer(
        //     "CollisionLayer",
        //     CollisionTilset
        // )!,
    };

    return layers as GameLayers;
}
export function setupDepths(layers: GameLayers) {
    layers.ground.setDepth(Keys.DEPTH.GROUND);
    layers.world.setDepth(Keys.DEPTH.WORLD);
    layers.overlay.setDepth(Keys.DEPTH.OVERLAY);
    // layers.collision.setDepth(Keys.DEPTH.COLLISION);
    // layers.collision.setVisible(false);
}
