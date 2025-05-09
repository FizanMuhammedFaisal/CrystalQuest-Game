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
    const BridgeTileset = scene.tilemap.addTilesetImage("bridge", "Bridge");
    const Tiles2Tileset = scene.tilemap.addTilesetImage("grass2", "Tiles2");

    if (
        !TreesTileset ||
        !tilesTileset ||
        !WoodWallsTileset ||
        !GroundSetTileset ||
        !BridgeTileset ||
        !Tiles2Tileset
    ) {
        throw new Error("Failed to load tilesets");
    }

    const layers = {
        ground: scene.tilemap.createLayer("GroundLayer", [
            tilesTileset,
            GroundSetTileset,
            Tiles2Tileset,
        ])!,
        world: scene.tilemap.createLayer("WorldLayer", [
            tilesTileset,
            TreesTileset,
            WoodWallsTileset,
            GroundSetTileset,
            Tiles2Tileset,
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
