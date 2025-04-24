import { Direction } from "../game/types/types";
import { DIRECTION } from "./common";

export function isDirection(direction: string): direction is Direction {
    return direction in DIRECTION;
}
