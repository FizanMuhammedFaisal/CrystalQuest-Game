// import { useGameStore } from "../../../stores/gameStore";
// import { Game } from "../Game";
// import * as Keys from "../../../common";

// const RESPAWN_TIME = 5000; // 5 seconds
// const SPAWN_POINTS_MEMORY = new Map<string, boolean>();

// export function spawnCrystals(spawnChance: number = 0.5, scene: Game) {
//     const objectLayer = scene.tilemap.getObjectLayer("ObjectLayer");
//     if (!objectLayer?.objects) {
//         console.error("Object layer not found!");
//         return;
//     }

//     const spawnPoints = objectLayer.objects.filter(
//         (obj: { name: string }) => obj.name === "crystal_spawn"
//     );

//     const crystals = scene.physics.add.group({
//         allowGravity: false,
//         immovable: true,
//     });

//     function spawnCrystalAtPoint(point: { x: number; y: number }) {
//         const pointKey = `${point.x}-${point.y}`;
//         if (SPAWN_POINTS_MEMORY.get(pointKey)) return; // Skip if point is "busy"

//         const crystal = crystals.create(point.x, point.y, "Crystal");
//         crystal.setScale(0.3);
//         crystal.setDepth(Keys.DEPTH.WORLD + 1);
//         crystal.play("crystal-spin");
//         crystal.setData("spawnPoint", pointKey);

//         // Mark this point as occupied
//         SPAWN_POINTS_MEMORY.set(pointKey, true);
//     }

//     function respawnCrystal(pointKey: string) {
//         if (!useGameStore.getState().isGameComplete) {
//             const point = spawnPoints.find(
//                 (p: { x: number; y: number }) => `${p.x}-${p.y}` === pointKey
//             );
//             if (point && Math.random() < spawnChance) {
//                 scene.time.delayedCall(RESPAWN_TIME, () => {
//                     SPAWN_POINTS_MEMORY.set(pointKey, false);
//                     spawnCrystalAtPoint(point);
//                 });
//             }
//         }
//     }

//     // Initial spawn
//     spawnPoints.forEach((point: { x: number; y: number }) => {
//         if (Math.random() < spawnChance) {
//             spawnCrystalAtPoint(point);
//         }
//     });

//     // Collision handling
//     scene.physics.add.overlap(
//         scene.player,
//         crystals,
//         (
//             _player: Phaser.GameObjects.Sprite,
//             crystal: Phaser.GameObjects.Sprite
//         ) => {
//             if (crystal.getData("isBeingCollected")) return;

//             const gameStore = useGameStore.getState();
//             if (gameStore.canCollectCrystal()) {
//                 crystal.setData("isBeingCollected", true);

//                 // Collection animation
//                 scene.tweens.add({
//                     targets: crystal,
//                     scale: 0,
//                     alpha: 0,
//                     duration: 200,
//                     onComplete: () => {
//                         const spawnPoint = crystal.getData("spawnPoint");
//                         crystal.destroy();
//                         gameStore.collectCrystal();

//                         // Trigger respawn
//                         respawnCrystal(spawnPoint);
//                     },
//                 });
//             }
//         }
//     );

//     return crystals;
// }
