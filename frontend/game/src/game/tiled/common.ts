export const TILED_AREA_OBJECT_PROPERTY = {
    ID: "id",
} as const;

export const TILED_LAYER_NAMES = {
    AREAS: "areas",
    PASSAGE: "passage",
    ENEMIES: "enemies",
    COLLISION: "CollisionLayer",
    ENEMY_COLLISION: "enemy_collision",
} as const;

export const TILED_TILESET_NAMES = {
    COLLISION: "collision",
} as const;

export const TILED_PASSAGE_OBJECT_PROPERTY = {
    TARGET_PASSAGE_ID: "targetPassageId",
    TARGET_AREA_ID: "targetAreaId",
    TARGET_LEVEL: "targetLevel",
    ID: "id",
    DIRECTION: "direction",
    PASSAGE_TYPE: "passageType",
    IS_LEVEL_TRANSITION: "isLevelTransition",
} as const;
export const PASSAGE_TYPE = {
    OPEN: "OPEN",
    LOCK: "LOCK",
} as const;
