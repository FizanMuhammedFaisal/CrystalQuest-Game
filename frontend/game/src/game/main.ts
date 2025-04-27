import Phaser, { Game } from "phaser";
import * as scenes from "./scenes";

const config: Phaser.Types.Core.GameConfig = {
    width: 1024, // 1024
    height: 768, // 768
    title: "Phaser RPG",
    type: Phaser.WEBGL,
    parent: "game-container",
    backgroundColor: "#000000",
    scene: [
        scenes.Boot,
        ...Object.values(scenes).filter((scene) => scene !== scenes.Boot),
    ],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    plugins: {},
    // pipeline: {
    //     DayNight: DayNightPipeline,
    // },
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true,
    },
    transparent: false,
};
//Takes parent (html id) where games shoud be mounted  and returns phaser game instance
const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
