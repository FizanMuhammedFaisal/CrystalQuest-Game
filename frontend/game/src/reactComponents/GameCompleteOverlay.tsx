import { motion } from "framer-motion";
import { useGameStore } from "../stores/gameStore";
import { PixelButton } from "./GameUI";

export function GameCompleteOverlay() {
    const { isGameComplete, resetGame, crystalsServed } = useGameStore();

    if (!isGameComplete) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 p-8 rounded-lg text-center font-pixel"
            >
                <h2 className="text-3xl mb-4 text-emerald-700">
                    Fountain Restored!
                </h2>
                <p className="mb-6 text-gray-700">
                    You've collected {crystalsServed} crystals and restored the
                    fountain!
                </p>
                <div className="flex gap-4 justify-center">
                    <PixelButton
                        variant="success"
                        size="lg"
                        onClick={() => {
                            resetGame();
                            // // Optionally reload the game scene
                            // window.location.reload();
                        }}
                    >
                        Play Again
                    </PixelButton>
                </div>
            </motion.div>
        </motion.div>
    );
}
