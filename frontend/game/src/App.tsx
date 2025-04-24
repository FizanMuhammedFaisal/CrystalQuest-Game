import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import CrystalHUD from "./reactComponents/CrystalHUD";
import { Notification } from "./reactComponents/GameUI";
import { useGameStore } from "./stores/gameStore";
import { GameCompleteOverlay } from "./reactComponents/GameCompleteOverlay";

function App() {
    console.log("gamlaunch");
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const { message, messageType, isGameComplete } = useGameStore();

    return (
        <div id="app">
            <CrystalHUD className="fixed top-4 right-4 bg-white/20 backdrop-blur-sm p-4 roundedlg text-black" />
            <PhaserGame ref={phaserRef} />
            {message && (
                <Notification
                    onClose={useGameStore.getState().clearMessage}
                    type={messageType}
                    message={message}
                />
            )}
            {isGameComplete && <GameCompleteOverlay />}
        </div>
    );
}

export default App;
