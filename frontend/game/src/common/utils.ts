import { Direction, Position } from "../game/types/types";
import { DIRECTION } from "./common";

export function isDirection(direction: string): direction is Direction {
    return direction in DIRECTION;
}
export function getDirectionOfObjectFromAnotherObject(
    object: Position,
    targetObject: Position
): Direction {
    if (object.y < targetObject.y) {
        return DIRECTION.DOWN;
    }
    if (object.y > targetObject.y) {
        return DIRECTION.UP;
    }
    if (object.x < targetObject.x) {
        return DIRECTION.RIGHT;
    }
    return DIRECTION.LEFT;
}
