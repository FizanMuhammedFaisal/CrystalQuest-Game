export const DEPTH = {
    GROUND: 0,
    WORLD: 2,
    PLAYER: 20, //grid engine sets it to 3.0 and correspoding y axis
    OVERLAY: 30,
    COLLISION: 30,
} as const;
