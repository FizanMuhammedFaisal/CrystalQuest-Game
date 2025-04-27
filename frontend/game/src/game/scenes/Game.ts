import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { setupLayers, GameLayers, setupDepths } from "./GameScene/layers";

import { globalTime } from "../TimeManager";
import { KeyboardComponent } from "../components/input/keyboardComponent";
import { EnimieSlime } from "../entities/enimies/enimieSlime";
import { CharactrerGameObject } from "../components/gameobject/common/characterGameObject";
import { DIRECTION } from "../../common/common";
import { DEBUG_COLLISION_ALPHA, PLAYER_START_MAX_HEALTH } from "../../config";
import { LevelData } from "../types/types";
import { TiledAreaObject } from "../tiled/types";
import { TILED_LAYER_NAMES } from "../tiled/common";
import {
    getAllLayerNamesWithPrefix,
    getTiledAreaObjectsFromMap,
    getTiledEnemyObjectsFromMap,
    getTiledPassagerObjectsFromMap,
} from "../tiled/tiled-utils";
import { Passage } from "../components/gameobject/objects/passage";
import { getDirectionOfObjectFromAnotherObject } from "../../common/utils";

export class Game extends Scene {
    public tilemap: Phaser.Tilemaps.Tilemap;
    private layers: GameLayers;
    public player: Player;
    public enimieGroup: Phaser.GameObjects.Group;
    private controls!: KeyboardComponent;
    public levelData: LevelData;
    private collitionLayer: Phaser.Tilemaps.TilemapLayer;
    public objectByAreaId: {
        [key: number]: {
            passageMap: { [key: number]: Passage };
            passage: Passage[];
            enemyGroup?: Phaser.GameObjects.Group;
            area: TiledAreaObject;
        };
    };
    private currentAreaId: number;
    private passageTransitionGroup: Phaser.GameObjects.Group;
    constructor() {
        super("Game");
    }
    public init(data: LevelData): void {
        this.levelData = data;
        this.currentAreaId = data.areaId;
    }
    // setupFountainStone(this);
    // spawnCrystals(0.9, this);
    create() {
        this.tilemap = this.make.tilemap({ key: "game-map" });
        if (!this.input.keyboard) {
            return;
        }
        this.controls = new KeyboardComponent(this.input.keyboard);
        this.layers = setupLayers(this);
        this.setupPlayer();
        this.player.setDepth(0);
        setupDepths(this.layers);
        this.createLevel();

        this.registerColliders();
        // 4. Setup camera bounds and follow

        // setupControls(this, this.gameCamera);
        this.physics.world.createDebugGraphic();

        const areaSize = this.objectByAreaId[this.levelData.areaId].area;
        console.log(areaSize);

        this.cameras.main.setBounds(
            areaSize.x,
            areaSize.y - areaSize.height,
            areaSize.width,
            areaSize.height
        );
        // this.physics.world.setBounds(
        //     areaSize.x,
        //     areaSize.y - areaSize.height,
        //     areaSize.width,
        //     areaSize.height
        // );
        this.physics.world.setBounds(0, 0, 9999, 9999);

        this.cameras.main.setZoom(1.8);

        this.cameras.main.setFollowOffset(
            -areaSize.width / 2,
            -areaSize.height / 2
        );

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    private createLevel() {
        const collitionTiled = this.tilemap.addTilesetImage(
            "Collition", // This should match the name in your Tiled map
            "CollisionTiles"
        );
        if (collitionTiled === null) {
            console.log("error creating collition layer");
            return;
        }

        this.enimieGroup = this.add.group(
            new EnimieSlime({
                scene: this,
                positions: { x: 330, y: 110 },
            }),
            {
                // runChildUpdate: true,
            }
        );
        const collitionLayer = this.tilemap.createLayer(
            TILED_LAYER_NAMES.COLLISION,
            [collitionTiled],
            0,
            0
        );

        if (!collitionLayer) {
            console.log("error creating collition layer");
        }

        this.collitionLayer = collitionLayer;

        this.collitionLayer.setDepth(4).setAlpha(DEBUG_COLLISION_ALPHA);

        this.objectByAreaId = {};
        this.passageTransitionGroup = this.add.group([]);

        this.createAreas(this.tilemap, TILED_LAYER_NAMES.AREAS);

        const area = getAllLayerNamesWithPrefix(
            this.tilemap,
            TILED_LAYER_NAMES.AREAS
        ).map((layerName: string) => {
            return {
                name: layerName,
                areaId: parseInt(layerName.split("/")[1]),
            };
        });

        const passageLayerNames = area.filter((layer) => {
            return layer.name.endsWith(`/${TILED_LAYER_NAMES.PASSAGE}`);
        });

        const enemiesLayerNames = area.filter((layer) => {
            return layer.name.endsWith(`/${TILED_LAYER_NAMES.ENEMIES}`);
        });

        passageLayerNames.forEach((layer) => {
            this.createPassage(this.tilemap, layer.name, layer.areaId);
        });
        enemiesLayerNames.forEach((layer) => {
            this.createEnemies(this.tilemap, layer.name, layer.areaId);
        });
    }
    private setupPlayer() {
        this.player = new Player({
            scene: this,
            positions: { x: 400, y: 900 },
            controls: this.controls,
            maxLife: PLAYER_START_MAX_HEALTH,
            currentLife: PLAYER_START_MAX_HEALTH,
        });
    }
    private registerColliders(): void {
        this.enimieGroup.getChildren().forEach((enimie) => {
            const enemyGameObject = enimie as CharactrerGameObject;
            enemyGameObject.setCollideWorldBounds(true);
        });
        this.physics.add.overlap(
            this.player,
            this.enimieGroup,
            (player, enemy) => {
                this.player.hit(DIRECTION.DOWN, 1);
                const enemyGameObject = enemy as CharactrerGameObject;
                enemyGameObject.hit(this.player.direction, 1);
            }
        );
        this.collitionLayer.setCollision(
            this.collitionLayer.tileset[0].firstgid
        );
        this.physics.add.collider(this.player, this.collitionLayer);
        this.physics.add.overlap(
            this.player,
            this.passageTransitionGroup,
            (playerObj, passageObj) => {
                this.handlePassageTransition(
                    passageObj as Phaser.Types.Physics.Arcade.GameObjectWithBody
                );
            }
        );
    }

    private createAreas(map: Phaser.Tilemaps.Tilemap, layerName: string): void {
        const validTiledObjects = getTiledAreaObjectsFromMap(map, layerName);

        validTiledObjects.forEach((tiledObject) => {
            this.objectByAreaId[tiledObject.id] = {
                passageMap: {},
                area: tiledObject,
                passage: [],
            };
        });
    }

    private createPassage(
        map: Phaser.Tilemaps.Tilemap,
        layerName: string,
        areaId: number
    ): void {
        const validTiledObjects = getTiledPassagerObjectsFromMap(
            map,
            layerName
        );
        console.log("validTiledObjects");
        console.log(validTiledObjects);

        validTiledObjects.forEach((tiledObject) => {
            const passage = new Passage(this, tiledObject, areaId);
            console.log(this.objectByAreaId[areaId]);
            this.objectByAreaId[areaId].passage.push(passage);
            this.objectByAreaId[areaId].passageMap[tiledObject.id] = passage;
            this.passageTransitionGroup.add(passage.passageTransitionZone);
        });
    }
    private createEnemies(
        map: Phaser.Tilemaps.Tilemap,
        layerName: string,
        areaId: number
    ): void {
        const validTiledObjects = getTiledEnemyObjectsFromMap(map, layerName);
    }
    private handlePassageTransition(
        passageTrigger: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ): void {
        const passage = this.objectByAreaId[this.currentAreaId].passageMap[
            passageTrigger.name
        ] as Passage;

        const targetPassage = this.objectByAreaId[passage.targetareaId]
            .passageMap[passage.targetPassageId] as Passage;
        passage.disableObject();
        targetPassage.disableObject();
        const targetDirection = getDirectionOfObjectFromAnotherObject(
            passage,
            targetPassage
        );
        console.log("targetDirection for going ");
        console.log(targetDirection);
        console.log(passage);
        console.log(targetPassage);
        const differenceBetweenPassage = {
            x: Math.abs(
                passage.passageTransitionZone.x -
                    targetPassage.passageTransitionZone.x
            ),
            y: Math.abs(
                passage.passageTransitionZone.y -
                    targetPassage.passageTransitionZone.y
            ),
        };
        console.log("differnces between passages");
        console.log(differenceBetweenPassage);
        //for getting the correct direction based values
        if (targetDirection === DIRECTION.UP) {
            differenceBetweenPassage.y *= -1;
        }
        if (targetDirection === DIRECTION.LEFT) {
            differenceBetweenPassage.x *= -1;
        }
        //
        console.log(passage.x, passage.y);
        //   For X: Add half the zone width to center horizontally
        // For Y: Subtract half the zone height to center vertically
        const playerTargetPosition = {
            x:
                passage.x +
                passage.passageTransitionZone.width / 2 +
                differenceBetweenPassage.x,
            y:
                passage.y -
                passage.passageTransitionZone.height / 2 +
                differenceBetweenPassage.y,
        };
        console.log(playerTargetPosition);
        this.tweens.add({
            targets: this.player,
            y: playerTargetPosition.y,
            x: playerTargetPosition.x,
            duration: 900,
            delay: 250,
        });
        const areaSize = this.objectByAreaId[targetPassage.areaId].area;
        console.log("areaSize of target");
        console.log(areaSize);
        this.cameras.main.setBounds(
            this.cameras.main.worldView.x,
            this.cameras.main.worldView.y,
            this.cameras.main.worldView.width,
            this.cameras.main.worldView.height
        );
        const bounds = this.cameras.main.getBounds();
        this.cameras.main.stopFollow();

        this.tweens.add({
            targets: bounds,
            x: areaSize.x,
            y: areaSize.y - areaSize.height,
            duration: 900,
            delay: 250,
            onUpdate: () => {
                this.cameras.main.setBounds(
                    bounds.x,
                    bounds.y,
                    areaSize.width,
                    areaSize.height
                );
            },
        });

        const playerDistanceToMoveIntoArea = {
            x: differenceBetweenPassage.x,
            y: differenceBetweenPassage.y,
        };
        if (
            targetDirection === DIRECTION.UP ||
            targetDirection === DIRECTION.DOWN
        ) {
            playerDistanceToMoveIntoArea.y = Math.max(
                Math.abs(playerDistanceToMoveIntoArea.y),
                30
            );
            if (targetDirection === DIRECTION.UP) {
                playerDistanceToMoveIntoArea.y *= -1;
            }
        } else {
            playerDistanceToMoveIntoArea.x = Math.max(
                Math.abs(playerDistanceToMoveIntoArea.x),
                0
            );
            if (targetDirection === DIRECTION.LEFT) {
                playerDistanceToMoveIntoArea.x *= -1;
            }
        }

        this.tweens.add({
            targets: this.player,
            y: playerTargetPosition.y + playerDistanceToMoveIntoArea.y,
            x: playerTargetPosition.x + playerDistanceToMoveIntoArea.x,
            duration: 901,
            delay: 250,
            onComplete: () => {
                targetPassage.enableObject();
                this.currentAreaId = targetPassage.areaId;
                this.cameras.main.startFollow(this.player);
            },
        });
    }
    update(_time: number, delta: number) {
        // Update global time
        globalTime.updateTime(delta);
        // console.log(this.player.depth);
        // this.gameCamera.update(this);
        console.log(this.player.x, this.player.y);
    }
}
