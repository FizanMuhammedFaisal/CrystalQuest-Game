import { CHARACTER_ANIMATIONS } from "../../common/assets";
import { DIRECTION, LEVEL_NAME } from "../../common/common";

export type GameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
export type Direction = keyof typeof DIRECTION;
export type CharacterAnimation = keyof typeof CHARACTER_ANIMATIONS;

export type LevelData = {
    level: string;
    passageId: number;
    areaId: number;
};
export type LevelName = keyof typeof LEVEL_NAME;
export interface CustomGameObject {
    enableObject(): void;
    disableObject(): void;
}
export type Position = {
    x: number;
    y: number;
};
