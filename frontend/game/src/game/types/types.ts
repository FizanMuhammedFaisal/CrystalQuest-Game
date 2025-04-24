import { CHARACTER_ANIMATIONS } from "../../common/assets";
import { DIRECTION } from "../../common/common";

export type GameObject = Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;
export type Direction = keyof typeof DIRECTION;
export type CharacterAnimation = keyof typeof CHARACTER_ANIMATIONS;
