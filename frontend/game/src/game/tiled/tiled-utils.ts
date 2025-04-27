import * as Phaser from "phaser";
import {
    PassageType,
    TILED_ENEMY_OBJECT_PROPERTY,
    TiledAreaObject,
    TiledEnemyObject,
    TiledObjectProperty,
    TiledObjectWithProperties,
    TiledPassageObject,
} from "./types";
import {
    PASSAGE_TYPE,
    TILED_AREA_OBJECT_PROPERTY,
    TILED_PASSAGE_OBJECT_PROPERTY,
    TILED_ROOM_OBJECT_PROPERTY,
} from "./common";

import { LevelName } from "./types";
import { isDirection } from "../../common/utils";

/**
 * Validates that the provided property is of the type TiledObjectProperty.
 */
export function isTiledObjectProperty(
    property: unknown
): property is TiledObjectProperty {
    if (
        typeof property !== "object" ||
        property === null ||
        property === undefined
    ) {
        return false;
    }
    return (
        property["name"] !== undefined &&
        property["type"] !== undefined &&
        property["value"] !== undefined
    );
}

/**
 * Returns an array of validated TiledObjectProperty objects from the provided Phaser Tiled Object properties.
 */
export function getTiledProperties(properties: unknown): TiledObjectProperty[] {
    const validProperties: TiledObjectProperty[] = [];

    if (
        typeof properties !== "object" ||
        properties === null ||
        properties === undefined ||
        !Array.isArray(properties)
    ) {
        return validProperties;
    }
    properties.forEach((property) => {
        if (!isTiledObjectProperty(property)) {
            return;
        }
        validProperties.push(property);
    });

    return validProperties;
}

/**
 * Returns the value of the given Tiled property name on an object. In Tiled the object properties are
 * stored on an array, and we need to loop through the Array to find the property we are looking for.
 */
export function getTiledPropertyByName<T>(
    properties: TiledObjectProperty[],
    propertyName: string
): T | undefined {
    const tiledProperty = properties.find((prop) => {
        return prop.name === propertyName;
    });

    if (tiledProperty === undefined) {
        return undefined;
    }
    return tiledProperty.value as T;
}

/**
 * Finds all of the Tiled Objects for a given layer of a Tilemap, and filters to only objects that include
 * the basic properties for an objects position, width, and height.
 */
export function getTiledObjectsFromLayer(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
): TiledObjectWithProperties[] {
    const validTiledObjects: TiledObjectWithProperties[] = [];
    // get the Tiled object layer by its name
    const tiledObjectLayer = map.getObjectLayer(layerName);
    if (!tiledObjectLayer) {
        return validTiledObjects;
    }

    // loop through each object and validate object has basic properties for position, width, height, etc
    const tiledObjects = tiledObjectLayer.objects;
    tiledObjects.forEach((tiledObject) => {
        if (
            tiledObject.x === undefined ||
            tiledObject.y === undefined ||
            tiledObject.width === undefined ||
            tiledObject.height === undefined
        ) {
            return;
        }

        validTiledObjects.push({
            x: tiledObject.x,
            y: tiledObject.y,
            width: tiledObject.width,
            height: tiledObject.height,
            properties: getTiledProperties(tiledObject.properties),
        });
    });

    return validTiledObjects;
}

/**
 * Finds all of the Tiled Objects for a given layer of a Tilemap, and filters to only objects that include
 * the basic properties for an objects position, width, and height.
 */
export function getTiledObjectsFromLayerforPassage(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
): TiledObjectWithProperties[] {
    const validTiledObjects: TiledObjectWithProperties[] = [];
    // get the Tiled object layer by its name
    const tiledObjectLayer = map.getObjectLayer(layerName);
    if (!tiledObjectLayer) {
        return validTiledObjects;
    }

    // loop through each object and validate object has basic properties for position, width, height, etc
    const tiledObjects = tiledObjectLayer.objects;
    tiledObjects.forEach((tiledObject) => {
        if (
            tiledObject.x === undefined ||
            tiledObject.y === undefined ||
            tiledObject.width === undefined ||
            tiledObject.height === undefined
        ) {
            return;
        }

        validTiledObjects.push({
            x: tiledObject.x,
            y: tiledObject.y,
            width: tiledObject.width,
            height: tiledObject.height,
            properties: getTiledProperties(tiledObjectLayer.properties),
        });
    });

    return validTiledObjects;
}

/**
 * Finds all of the valid 'Area' Tiled Objects on a given layer of a Tilemap.
 */
export function getTiledAreaObjectsFromMap(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
): TiledAreaObject[] {
    const areaObjects: TiledAreaObject[] = [];

    // loop through each object and validate object has properties for the object we are planning to build
    const tiledObjects = getTiledObjectsFromLayer(map, layerName);

    tiledObjects.forEach((tiledObject) => {
        const id = getTiledPropertyByName<number>(
            tiledObject.properties,
            TILED_AREA_OBJECT_PROPERTY.ID
        );

        if (id === undefined) {
            return;
        }

        areaObjects.push({
            x: tiledObject.x,
            y: tiledObject.y,
            width: tiledObject.width,
            height: tiledObject.height,
            id,
        });
    });

    return areaObjects;
}

/**
 * Parses the provided Phaser Tilemap and returns all Object layer names with the provided prefix.
 * This function expects the layer names to be in a format like: rooms/1/enemies.
 */
export function getAllLayerNamesWithPrefix(
    map: Phaser.Tilemaps.Tilemap,
    prefix: string
): string[] {
    return map
        .getObjectLayerNames()
        .filter((layerName) => layerName.startsWith(`${prefix}/`))
        .filter((layerName) => {
            const layerData = layerName.split("/");
            if (layerData.length !== 3) {
                return false;
            }
            return true;
        });
}

/**
 * Finds all of the valid 'Passage' Tiled Objects on a given layer of a Tilemap.
 */
export function getTiledPassagerObjectsFromMap(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
): TiledPassageObject[] {
    const passageObjects: TiledPassageObject[] = [];

    // loop through each object and validate object has properties for the object we are planning to build
    const tiledObjects = getTiledObjectsFromLayer(map, layerName);

    tiledObjects.forEach((tiledObject) => {
        const passageId = getTiledPropertyByName<number>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.ID
        );
        const targetPassageId = getTiledPropertyByName<number>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.TARGET_PASSAGE_ID
        );
        const passageDirection = getTiledPropertyByName<string>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.DIRECTION
        );
        const passageType = getTiledPropertyByName<string>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.PASSAGE_TYPE
        );

        const isLevelTransition = getTiledPropertyByName<boolean>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.IS_LEVEL_TRANSITION
        );
        const targetLevel = getTiledPropertyByName<LevelName>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.TARGET_LEVEL
        );
        const targetAreaId = getTiledPropertyByName<number>(
            tiledObject.properties,
            TILED_PASSAGE_OBJECT_PROPERTY.TARGET_AREA_ID
        );
        if (
            passageId === undefined ||
            targetPassageId === undefined ||
            passageDirection === undefined ||
            passageType === undefined ||
            isLevelTransition === undefined ||
            targetLevel === undefined ||
            targetAreaId === undefined ||
            !isDirection(passageDirection) ||
            !isPassageType(passageType)
        ) {
            return;
        }

        passageObjects.push({
            x: tiledObject.x,
            y: tiledObject.y,
            width: tiledObject.width,
            height: tiledObject.height,
            id: passageId,
            targetPassageId: targetPassageId,
            direction: passageDirection,
            passageType: passageType,
            isLevelTransition,
            targetLevel,
            targetAreaId,
        });
    });

    return passageObjects;
}

export function isPassageType(passageType: string): passageType is PassageType {
    return PASSAGE_TYPE[passageType] !== undefined;
}

/**
 * Finds all of the valid 'Pot' Tiled Objects on a given layer of a Tilemap.
 */
// export function getTiledPotObjectsFromMap(
//     map: Phaser.Tilemaps.Tilemap,
//     layerName: string
// ): TiledPotObject[] {
//     const potObjects: TiledPotObject[] = [];

//     // loop through each object and validate object has properties for the object we are planning to build
//     const tiledObjects = getTiledObjectsFromLayer(map, layerName);
//     tiledObjects.forEach((tiledObject) => {
//         potObjects.push({
//             x: tiledObject.x,
//             y: tiledObject.y,
//             width: tiledObject.width,
//             height: tiledObject.height,
//         });
//     });

//     return potObjects;
// }

/**
 * Finds all of the valid 'Chest' Tiled Objects on a given layer of a Tilemap.
 */
// export function getTiledChestObjectsFromMap(
//     map: Phaser.Tilemaps.Tilemap,
//     layerName: string
// ): TiledChestObject[] {
//     const chestObjects: TiledChestObject[] = [];

//     // loop through each object and validate object has properties for the object we are planning to build
//     const tiledObjects = getTiledObjectsFromLayer(map, layerName);
//     tiledObjects.forEach((tiledObject) => {
//         const contents = getTiledPropertyByName<ChestReward>(
//             tiledObject.properties,
//             TILED_CHEST_OBJECT_PROPERTY.CONTENTS
//         );
//         const id = getTiledPropertyByName<number>(
//             tiledObject.properties,
//             TILED_CHEST_OBJECT_PROPERTY.ID
//         );
//         const revealChestTrigger = getTiledPropertyByName<TrapType>(
//             tiledObject.properties,
//             TILED_CHEST_OBJECT_PROPERTY.REVEAL_CHEST_TRIGGER
//         );
//         const requiresBossKey = getTiledPropertyByName<boolean>(
//             tiledObject.properties,
//             TILED_CHEST_OBJECT_PROPERTY.REQUIRES_BOSS_KEY
//         );
//         if (
//             contents === undefined ||
//             id === undefined ||
//             revealChestTrigger === undefined ||
//             requiresBossKey === undefined ||
//             !isTrapType(revealChestTrigger) ||
//             !isChestReward(contents)
//         ) {
//             return;
//         }

//         chestObjects.push({
//             x: tiledObject.x,
//             y: tiledObject.y,
//             width: tiledObject.width,
//             height: tiledObject.height,
//             id,
//             revealChestTrigger,
//             contents,
//             requiresBossKey,
//         });
//     });

//     return chestObjects;
// }

// export function isChestReward(reward: string): reward is ChestReward {
//     return CHEST_REWARD[reward] !== undefined;
// }

/**
 * Finds all of the valid 'Enemy' Tiled Objects on a given layer of a Tilemap.
 */
export function getTiledEnemyObjectsFromMap(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string
): TiledEnemyObject[] {
    const enemyObjects: TiledEnemyObject[] = [];

    // loop through each object and validate object has properties for the object we are planning to build
    const tiledObjects = getTiledObjectsFromLayer(map, layerName);
    tiledObjects.forEach((tiledObject) => {
        const enemyType = getTiledPropertyByName<number>(
            tiledObject.properties,
            TILED_ENEMY_OBJECT_PROPERTY.TYPE
        );
        if (enemyType === undefined) {
            return;
        }

        enemyObjects.push({
            x: tiledObject.x,
            y: tiledObject.y,
            width: tiledObject.width,
            height: tiledObject.height,
            type: enemyType,
        });
    });

    return enemyObjects;
}

// /**
//  * Finds all of the valid 'Switch' Tiled Objects on a given layer of a Tilemap.
//  */
// export function getTiledSwitchObjectsFromMap(
//     map: Phaser.Tilemaps.Tilemap,
//     layerName: string
// ): TiledSwitchObject[] {
//     const switchObjects: TiledSwitchObject[] = [];

//     // loop through each object and validate object has properties for the object we are planning to build
//     const tiledObjects = getTiledObjectsFromLayer(map, layerName);
//     tiledObjects.forEach((tiledObject) => {
//         const action = getTiledPropertyByName<string>(
//             tiledObject.properties,
//             TILED_SWITCH_OBJECT_PROPERTY.ACTION
//         );
//         const targetIds = getTiledPropertyByName<string>(
//             tiledObject.properties,
//             TILED_SWITCH_OBJECT_PROPERTY.TARGET_IDS
//         );
//         const texture = getTiledPropertyByName<string>(
//             tiledObject.properties,
//             TILED_SWITCH_OBJECT_PROPERTY.TEXTURE
//         );

//         if (
//             action === undefined ||
//             targetIds === undefined ||
//             texture === undefined ||
//             !isSwitchAction(action) ||
//             !isSwitchTexture(texture)
//         ) {
//             return;
//         }

//         switchObjects.push({
//             x: tiledObject.x,
//             y: tiledObject.y,
//             width: tiledObject.width,
//             height: tiledObject.height,
//             action,
//             targetIds: targetIds.split(",").map((value) => parseInt(value, 10)),
//             texture,
//         });
//     });

//     return switchObjects;
// }

// export function isSwitchTexture(
//     switchTexture: string
// ): switchTexture is SwitchTexture {
//     return SWITCH_TEXTURE[switchTexture] !== undefined;
// }

// export function isSwitchAction(
//     switchAction: string
// ): switchAction is SwitchAction {
//     return SWITCH_ACTION[switchAction] !== undefined;
// }
