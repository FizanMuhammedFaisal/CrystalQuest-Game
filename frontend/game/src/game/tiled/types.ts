import { Direction } from "../types/types";
import { PASSAGE_TYPE } from "./common";

export type TiledObject = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type TiledObjectProperty = {
    name: string;
    type: string;
    value: string | number | boolean;
};

export type TiledObjectWithProperties = {
    properties: TiledObjectProperty[];
} & TiledObject;

export type TiledAreaObject = {
    id: number;
} & TiledObject;

export type TiledPassageObject = {
    id: number;
    targetPassageId: number;
    passageType: PassageType;
    direction: Direction;
    isLevelTransition: boolean;
    targetLevel: string;
    targetAreaId: number;
} & TiledObject;

export type PassageType = keyof typeof PASSAGE_TYPE;

export type TiledEnemyObject = {
    type: number;
} & TiledObject;

export const TILED_ENEMY_OBJECT_PROPERTY = {
    TYPE: "type",
} as const;
