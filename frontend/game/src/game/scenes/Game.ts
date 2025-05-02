import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { setupLayers, GameLayers, setupDepths } from "./GameScene/layers";

import { globalTime } from "../TimeManager";
import { KeyboardComponent } from "../components/input/keyboardComponent";
import { EnimieSlime } from "../entities/enimies/enimieSlime";
import { CharactrerGameObject } from "../components/gameobject/common/characterGameObject";
import { DIRECTION } from "../../common/common";
import { DEBUG_COLLISION_ALPHA, PLAYER_START_MAX_HEALTH } from "../../config";
import { Direction, LevelData } from "../types/types";
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
import { InventoryManager } from "../components/inventory/inventoryManager";

export class Game extends Scene {
    public tilemap: Phaser.Tilemaps.Tilemap;
    private layers: GameLayers;
    public player: Player;
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
        console.log(InventoryManager.instance);
    }

    create() {
        this.tilemap = this.make.tilemap({ key: "game-map" });
        if (!this.input.keyboard) {
            return;
        }
        this.controls = new KeyboardComponent(this.input.keyboard);
        this.layers = setupLayers(this);
        this.setupPlayer();
        this.player.setDepth(3);
        setupDepths(this.layers);
        this.createLevel();

        this.registerColliders();
        // 4. Setup camera bounds and follow

        // setupControls(this, this.gameCamera);

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

        this.cameras.main.setZoom(2.8);

        // this.cameras.main.setFollowOffset(
        //     -areaSize.width / 2,
        //     -areaSize.height / 2
        // );

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
            positions: { x: 400, y: 200 },
            controls: this.controls,
            maxLife: PLAYER_START_MAX_HEALTH,
            currentLife: PLAYER_START_MAX_HEALTH,
        });
    }
    private registerColliders(): void {
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

        Object.keys(this.objectByAreaId).forEach((key) => {
            const areaId = parseInt(key);
            if (this.objectByAreaId[areaId] === undefined) {
                return;
            }
            if (this.objectByAreaId[areaId].enemyGroup !== undefined) {
                this.objectByAreaId[areaId].enemyGroup
                    .getChildren()
                    .forEach((enimie) => {
                        const enemyGameObject = enimie as CharactrerGameObject;
                        enemyGameObject.setCollideWorldBounds(true);
                    });
                this.physics.add.overlap(
                    this.player,
                    this.objectByAreaId[areaId].enemyGroup,
                    (player, enemy) => {
                        this.player.hit(DIRECTION.DOWN, 1);
                        const enemyGameObject = enemy as CharactrerGameObject;
                        enemyGameObject.hit(this.player.direction, 1);
                    }
                );
            }
        });
    }

    private createAreas(map: Phaser.Tilemaps.Tilemap, layerName: string): void {
        const validTiledObjects = getTiledAreaObjectsFromMap(map, layerName);
        console.log(validTiledObjects);
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
            console.log(areaId);
            console.log(this.objectByAreaId);
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
        console.log(validTiledObjects);
        if (this.objectByAreaId[areaId].enemyGroup === undefined) {
            this.objectByAreaId[areaId].enemyGroup = this.add.group([], {
                runChildUpdate: true,
            });
        }

        for (const tiledObject of validTiledObjects) {
            if (
                tiledObject.type !== 1 &&
                tiledObject.type !== 2 &&
                tiledObject.type !== 3
            ) {
                continue;
            }
            if (tiledObject.type === 1) {
                const slimeEnimie = new EnimieSlime({
                    scene: this,
                    positions: { x: tiledObject.x, y: tiledObject.y },
                });
                this.objectByAreaId[areaId].enemyGroup?.add(slimeEnimie);
                continue;
            }
        }
    }
    private handlePassageTransition(
        passageTrigger: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ): void {
        console.log("asdfads");
        console.log("asdfads");
        const passage = this.objectByAreaId[this.currentAreaId].passageMap[
            passageTrigger.name
        ] as Passage;
        console.log(passage.targetareaId);
        const targetPassage = this.objectByAreaId[passage.targetareaId]
            .passageMap[passage.targetPassageId] as Passage;
        passage.disableObject();
        targetPassage.disableObject();
        const targetDirection = getDirectionOfObjectFromAnotherObject(
            passage,
            targetPassage
        );
        console.log(targetDirection);
        this.input.enabled = false;
        this.startPassageTransition(passage, targetPassage, targetDirection);
    }
    private startPassageTransition(
        passage: Passage,
        targetPassage: Passage,
        dir: Direction
    ): void {
        // Disable player input during transition
        this.input.enabled = false;

        // Create transition overlay with position based on direction
        const transitionScreen = this.add.rectangle(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        );
        transitionScreen.setScrollFactor(0).setDepth(9999).setOrigin(0);

        // Position the black screen outside the viewport based on direction
        if (dir === DIRECTION.UP) {
            transitionScreen.y = this.cameras.main.height; // Position below the screen
        } else if (dir === DIRECTION.DOWN) {
            transitionScreen.y = -this.cameras.main.height; // Position above the screen
        } else if (dir === DIRECTION.LEFT) {
            transitionScreen.x = this.cameras.main.width; // Position to the right
        } else if (dir === DIRECTION.RIGHT) {
            transitionScreen.x = -this.cameras.main.width; // Position to the left
        }

        // Slide in the black screen from the appropriate direction
        this.tweens.add({
            targets: transitionScreen,
            x: 0,
            y: 0,
            duration: 500,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                this.changeArea(passage, targetPassage, dir, transitionScreen);
            },
        });
    }

    private changeArea(
        passage: Passage,
        targetPassage: Passage,
        dir: Direction,
        transitionScreen: Phaser.GameObjects.Rectangle
    ) {
        this.currentAreaId = targetPassage.areaId;

        // player position
        const passageWidth = targetPassage.passageTransitionZone.width || 32;
        const passageHeight = targetPassage.passageTransitionZone.height || 32;
        const playerWidth = this.player.width || 32;
        const playerHeight = this.player.height || 32;
        const offset = 20;

        let playerX = targetPassage.x;
        let playerY = targetPassage.y;

        if (targetPassage.direction === DIRECTION.UP) {
            playerX += passageWidth / 2 - playerWidth / 2;
            playerY += passageHeight + offset;
        } else if (targetPassage.direction === DIRECTION.DOWN) {
            playerX += passageWidth / 2 - playerWidth / 2;
            playerY -= playerHeight + offset;
        } else if (targetPassage.direction === DIRECTION.LEFT) {
            playerX += passageWidth + offset;
            playerY += passageHeight / 2 - playerHeight / 2;
        } else if (targetPassage.direction === DIRECTION.RIGHT) {
            playerX -= playerWidth + offset;
            playerY += passageHeight / 2 - playerHeight / 2;
        }

        this.player.x = playerX;
        this.player.y = playerY;

        const areaSize = this.objectByAreaId[this.currentAreaId].area;
        this.cameras.main.setBounds(
            areaSize.x,
            areaSize.y - areaSize.height,
            areaSize.width,
            areaSize.height
        );

        passage.enableObject();
        targetPassage.enableObject();

        // Short delay before revealing the new area
        this.time.delayedCall(100, () => {
            // Calculate exit direction (opposite of entry)
            let exitX = 0;
            let exitY = 0;

            // Set exit position based on passage direction
            if (targetPassage.direction === DIRECTION.UP) {
                exitY = -this.cameras.main.height; // Exit upward
            } else if (targetPassage.direction === DIRECTION.DOWN) {
                exitY = this.cameras.main.height; // Exit downward
            } else if (targetPassage.direction === DIRECTION.LEFT) {
                exitX = -this.cameras.main.width; // Exit to the left
            } else if (targetPassage.direction === DIRECTION.RIGHT) {
                exitX = this.cameras.main.width; // Exit to the right
            }

            this.tweens.add({
                targets: transitionScreen,
                x: exitX,
                y: exitY,
                duration: 800,
                ease: "Back.easeIn",
                easeParams: [1.7],
                onComplete: () => {
                    transitionScreen.destroy();
                    this.input.enabled = true;
                },
            });
        });
    }

    update(_time: number, delta: number) {
        // Update global time
        globalTime.updateTime(delta);
        // console.log(this.player.depth);
        // this.gameCamera.update(this);
        // console.log(this.player.x, this.player.y);
    }
}
