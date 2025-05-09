import { ASSET_KEYS } from "./assets";

export const DIRECTION = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
} as const;

export const LEVEL_NAME = {
    GROUND: "GROUND",
} as const;

export const DEFAULT_UI_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
    align: "center",
    fontFamily: ASSET_KEYS.FONT_PRESS_START_2P,
    fontSize: 20,
    wordWrap: { width: 170 },
    color: "#FFFFFF",
};

export const DIALOG = {
    TESTING: "This is a testing dialog",
};
