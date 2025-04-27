export function logAllDepths(scene: Phaser.Scene) {
    console.group("🎮 Game Depths");

    // Log all game objects
    const gameObjects = scene.children.list;
    gameObjects.forEach((obj) => {
        const name = obj.constructor.name;
        const type = obj.type;
        const depth = (obj as any).depth;
        if (depth !== undefined) {
            console.log(`${name} (${type}): depth = ${depth}`);
        }
    });

    // Specifically log tilemap layers if they exist
    const tilemap = (scene as any).tilemap;
    if (tilemap && tilemap.layers) {
        console.group("🗺️ Tilemap Layers");
        tilemap.layers.forEach((layer: Phaser.Tilemaps.TilemapLayer) => {
            console.log(`${layer.layer.name}: depth = ${layer.depth}`);
        });
        console.groupEnd();
    }

    // Log player depth specifically
    const player = (scene as any).player;
    if (player) {
        console.group("👤 Player");
        console.log(`Player depth = ${player.depth}`);
        console.groupEnd();
    }

    console.groupEnd();
}
