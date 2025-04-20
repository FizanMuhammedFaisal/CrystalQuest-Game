import { Game } from "../Game";
import * as Keys from "../../../constants";

export interface GameLayers {
    ground: Phaser.Tilemaps.TilemapLayer;
    world: Phaser.Tilemaps.TilemapLayer;
    overlay: Phaser.Tilemaps.TilemapLayer;
    collision: Phaser.Tilemaps.TilemapLayer;
}

export function setupLayers(scene: Game): GameLayers {
    const tilesTileset = scene.tilemap.addTilesetImage("Tiles", "Tiles");
    const TreesTileset = scene.tilemap.addTilesetImage("trees", "Trees");
    const WoodWallsTileset = scene.tilemap.addTilesetImage(
        "WoodWalls",
        "WoodWalls"
    );
    const CollisionTilset = scene.tilemap.addTilesetImage(
        "CollisionTiles",
        "CollisionTiles"
    );

    if (!TreesTileset || !tilesTileset || !WoodWallsTileset) {
        throw new Error("Failed to load tilesets");
    }

    const layers = {
        ground: scene.tilemap.createLayer("GroundLayer", tilesTileset)!,
        world: scene.tilemap.createLayer("WorldLayer", [
            tilesTileset,
            TreesTileset,
            WoodWallsTileset,
        ])!,
        overlay: scene.tilemap.createLayer("OverlayLayer", [
            TreesTileset,
            WoodWallsTileset,
        ])!,
        collision: scene.tilemap.createLayer(
            "CollisionLayer",
            CollisionTilset
        )!,
    };

    return layers;
}
export function setupDepths(layers: GameLayers) {
    layers.ground.setDepth(Keys.DEPTH.GROUND);
    layers.world.setDepth(Keys.DEPTH.WORLD);
    layers.overlay.setDepth(Keys.DEPTH.OVERLAY);
    layers.collision.setDepth(Keys.DEPTH.COLLISION);
    layers.collision.setVisible(false);
}
