import { create } from "zustand";
type MessageType = "success" | "error" | null;
interface GameState {
    // State
    crystalsHeld: number;
    crystalsServed: number;
    maxCrystals: number;
    message: string | null;
    targetCrystals: number;
    isGameComplete: boolean;
    messageType: MessageType;
    // Actions
    collectCrystal: () => void;
    serveCrystals: () => void;
    canCollectCrystal: () => boolean;
    clearMessage: () => void;
    setMessage: (message: string | null, type: MessageType) => void;
    checkWinCondition: () => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    crystalsHeld: 0,
    crystalsServed: 0,
    maxCrystals: 5,
    message: null,
    targetCrystals: 5,
    isGameComplete: false,
    messageType: null,
    collectCrystal: () => {
        console.log("collecting");
        if (get().canCollectCrystal()) {
            console.log("collected");
            set((state) => ({
                crystalsHeld: state.crystalsHeld + 1,
            }));
        }
    },
    setMessage: (message, type) => {
        set({ message, messageType: type });
        // Auto-clear message after 2 seconds
        setTimeout(() => {
            set({ message: null, messageType: null });
        }, 2000);
    },

    clearMessage: () => {
        set({ message: null, messageType: null });
    },

    serveCrystals: () => {
        set((state) => {
            const newCrystalsServed = state.crystalsServed + state.crystalsHeld;

            // Check if this service will complete the game
            if (
                !state.isGameComplete &&
                newCrystalsServed >= state.targetCrystals
            ) {
                get().setMessage(
                    "Congratulations! You've restored the fountain!",
                    "success"
                );
            }

            return {
                crystalsServed: newCrystalsServed,
                crystalsHeld: 0,
                isGameComplete: newCrystalsServed >= state.targetCrystals,
            };
        });

        get().checkWinCondition();
    },

    checkWinCondition: () => {
        const { crystalsServed, targetCrystals, isGameComplete } = get();

        if (!isGameComplete && crystalsServed >= targetCrystals) {
            set({ isGameComplete: true });
            get().setMessage(
                "Congratulations! You've restored the fountain!",
                "success"
            );
        }
    },

    resetGame: () => {
        set({
            crystalsHeld: 0,
            crystalsServed: 0,
            isGameComplete: false,
            message: null,
            messageType: null,
        });
    },
    canCollectCrystal: () => {
        return get().crystalsHeld < get().maxCrystals;
    },
}));
