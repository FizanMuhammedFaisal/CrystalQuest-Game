import { Game } from "../Game";
import * as Keys from "../../../common";
import { useGameStore } from "../../../stores/gameStore";
export function setupFountainStone(scene: Game) {
    const objectLayer = scene.tilemap.getObjectLayer("ObjectLayer");
    if (!objectLayer?.objects) {
        console.error("Object layer not found!");
        return;
    }

    const fountainPoint = objectLayer.objects.find(
        (obj: { name: string }) => obj.name === "FountainStone"
    );

    if (!fountainPoint) {
        console.error("fountainStone point not found in map!");
        return;
    }

    const stone = scene.physics.add.sprite(
        fountainPoint.x!,
        fountainPoint.y!,
        "FountainStone"
    );
    stone.setDepth(Keys.DEPTH.WORLD + 1);

    scene.tweens.add({
        targets: stone,
        y: stone.y - 2,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
    });

    let isPlayerNearFountain = false;
    let isInteracting = false;

    scene.physics.add.overlap(
        scene.player,
        stone,
        () => {
            const gameStore = useGameStore.getState();

            // Only trigger interaction when player first enters the fountain area
            if (!isPlayerNearFountain) {
                isPlayerNearFountain = true;

                if (gameStore.crystalsHeld === 5 && !isInteracting) {
                    isInteracting = true;
                    scene.tweens.add({
                        targets: stone,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 300,
                        y: stone.y + 2,
                        yoyo: true,
                        onComplete: () => {
                            stone.play("fountainStone-glow", true);
                            gameStore.serveCrystals();
                            useGameStore
                                .getState()
                                .setMessage(
                                    "The fountain pulses with renewed energy!",
                                    "success"
                                );
                            setTimeout(() => {
                                stone.play("fountainStone-glow", false);
                                isInteracting = false;
                            }, 1000);
                        },
                    });
                } else if (gameStore.crystalsHeld < 5) {
                    useGameStore
                        .getState()
                        .setMessage(
                            `Gather ${
                                5 - gameStore.crystalsHeld
                            } more crystals to restore the fountain's light!`,
                            "error"
                        );
                } else if (gameStore.isGameComplete) {
                    useGameStore
                        .getState()
                        .setMessage(
                            "The fountain's power has been fully restored!",
                            "success"
                        );
                }
            }
        },
        undefined,
        scene
    );

    // Create a repeating timer instead of using update
    scene.time.addEvent({
        delay: 100, // Check every 100ms
        callback: () => {
            const distance = Phaser.Math.Distance.Between(
                scene.player.x,
                scene.player.y,
                stone.x,
                stone.y
            );

            if (distance > 50 && isPlayerNearFountain) {
                isPlayerNearFountain = false;
                useGameStore.getState().clearMessage();
            }
        },
        loop: true,
    });
}
