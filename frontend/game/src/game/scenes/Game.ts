import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { setupLayers, GameLayers, setupDepths } from "./GameScene/layers";

import { globalTime } from "../TimeManager";
import { KeyboardComponent } from "../components/input/keyboardComponent";
import { EnimieSlime } from "../entities/enimies/enimieSlime";
import { CharactrerGameObject } from "../components/gameobject/common/characterGameObject";
import { DIALOG, DIRECTION } from "../../common/common";
import { DEBUG_COLLISION_ALPHA, PLAYER_START_MAX_HEALTH } from "../../config";
import { Direction, GameObject, LevelData, LevelName } from "../types/types";
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

import { WeaponComponent } from "../components/gameobject/weaponComponent";
import { CUSTOM_EVENTS, EVENT_BUS } from "../../common/eventbus";
import { DataManager } from "../../common/dataManager";
// import { ShaderManager } from "../shaders/ShaderManager";
import { EnimieTorch } from "../entities/enimies/enimieTorch";

export class Game extends Scene {
    public tilemap: Phaser.Tilemaps.Tilemap;
    private layers: GameLayers;
    public player: Player;
    private controls!: KeyboardComponent;
    public levelData: LevelData;
    private collitionLayer: Phaser.Tilemaps.TilemapLayer;
    // private shaderManager: ShaderManager;
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

    create() {
        this.tilemap = this.make.tilemap({ key: "game-map" });
        if (!this.input.keyboard) {
            return;
        }
        this.controls = new KeyboardComponent(this.input.keyboard);
        this.layers = setupLayers(this);

        setupDepths(this.layers);
        this.createLevel();
        this.setupPlayer();
        this.player.setDepth(3);
        this.registerColliders();
        // 4. Setup camera bounds and follow

        // setupControls(this, this.gameCamera);

        const areaSize = this.objectByAreaId[this.levelData.areaId].area;

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
        this.scene.launch("UIScene");
        this.scene.launch("shaderScene");
        this.registerCustomEvents();
        // this.initializeShaders();
        // this.debugWebGLSupport();
    }
    private debugWebGLSupport(): void {
        // Check if WebGL is supported
        const canvas = document.createElement("canvas");
        const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");

        console.log("WebGL Context Available:", !!gl);
        console.log("Phaser Renderer Type:", this.game.renderer.type);
        console.log("Is WebGL:", this.game.renderer.type === Phaser.WEBGL);

        // Check ShaderScene is available
        const shaderSceneExists = !!this.game.scene.getScene("shaderScene");
        console.log("ShaderScene exists:", shaderSceneExists);
    }
    private initializeShaders(): void {
        // Create the shader manager (will also set up the shader scene)
        this.shaderManager = new ShaderManager(this);

        // Wait a frame before applying the shader to ensure everything is ready

        this.time.delayedCall(100, () => {
            if (this.shaderManager) {
                const initialShaderType = this.shaderManager.getShaderType(2);

                this.shaderManager.applyShader(initialShaderType, 100);
            }
        });
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
        const startingDoor =
            this.objectByAreaId[this.levelData.areaId].passageMap[
                this.levelData.passageId
            ];

        const playerStartPosition = {
            x: startingDoor.x + startingDoor.passageTransitionZone.width / 2,
            y: startingDoor.y - startingDoor.passageTransitionZone.height / 2,
        };

        switch (startingDoor.direction) {
            case DIRECTION.UP:
                playerStartPosition.y += 40;
                break;
            case DIRECTION.DOWN:
                playerStartPosition.y -= 40;
                break;
            case DIRECTION.LEFT:
                playerStartPosition.x += 40;
                break;
            case DIRECTION.RIGHT:
                playerStartPosition.x -= 40;
                break;
        }

        this.player = new Player({
            scene: this,
            positions: { x: playerStartPosition.x, y: playerStartPosition.y },
            controls: this.controls,
            maxLife: PLAYER_START_MAX_HEALTH,
            currentLife: PLAYER_START_MAX_HEALTH,
        }).setScale(1.2);
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
                    () => {
                        EVENT_BUS.emit(
                            CUSTOM_EVENTS.SHOW_DIALOG,
                            DIALOG.TESTING
                        );
                        this.player.hit(DIRECTION.DOWN, 1);
                    }
                );
                this.physics.add.overlap(
                    this.objectByAreaId[areaId].enemyGroup,
                    this.player.weaponCompoent.body,
                    (enemy) => {
                        (enemy as CharactrerGameObject).hit(
                            this.player.direction,
                            this.player.weaponCompoent.weaponDamage
                        );
                    }
                );

                this.physics.add.collider(
                    this.objectByAreaId[areaId].enemyGroup,
                    this.collitionLayer
                );
                this.physics.add.collider(
                    this.player,
                    this.objectByAreaId[areaId].enemyGroup
                );
                const enemyWeapons = this.objectByAreaId[areaId].enemyGroup
                    .getChildren()
                    .flatMap((enemy) => {
                        const weaponComponent =
                            WeaponComponent.getComponent<WeaponComponent>(
                                enemy as GameObject
                            );
                        if (weaponComponent !== undefined) {
                            return [weaponComponent.body];
                        }
                        return [];
                    });
                if (enemyWeapons.length > 0) {
                    this.physics.add.overlap(
                        enemyWeapons,
                        this.player,
                        (enemyWeaponBody) => {
                            const weaponComponent =
                                WeaponComponent.getComponent<WeaponComponent>(
                                    enemyWeaponBody as GameObject
                                );
                            if (
                                weaponComponent === undefined ||
                                weaponComponent.weapon === undefined
                            ) {
                                return;
                            }

                            weaponComponent.weapon.onCollitionCallback();

                            this.player.hit(
                                DIRECTION.DOWN,
                                weaponComponent.weaponDamage
                            );
                        }
                    );
                }
            }
        });
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

        validTiledObjects.forEach((tiledObject) => {
            const passage = new Passage(this, tiledObject, areaId);

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
            if (tiledObject.type === 2) {
                const torchEnimie = new EnimieTorch({
                    scene: this,
                    positions: { x: tiledObject.x, y: tiledObject.y },
                });
                this.objectByAreaId[areaId].enemyGroup?.add(torchEnimie);
                continue;
            }
        }
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

        this.input.enabled = false;

        this.startPassageTransition(passage, targetPassage, targetDirection);
        DataManager.instance.updateAreaData(
            passage.targetLevel as LevelName,
            passage.targetareaId,
            passage.targetPassageId
        );
        DataManager.instance.saveProgress();
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
                this.changeArea(passage, targetPassage, transitionScreen);
            },
        });
    }

    private changeArea(
        passage: Passage,
        targetPassage: Passage,

        transitionScreen: Phaser.GameObjects.Rectangle
    ) {
        this.currentAreaId = targetPassage.areaId;
        // const shaderType = this.shaderManager.getShaderType(this.currentAreaId);
        // this.shaderManager.applyShader(shaderType, 800);
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
    private registerCustomEvents(): void {
        EVENT_BUS.on(
            CUSTOM_EVENTS.ENEMY_DEFEATED,
            this.checkForAllEnemiesDefeated,
            this
        );
        EVENT_BUS.on(
            CUSTOM_EVENTS.PLAYER_DEFEATED,
            this.handlePlayerDefeatedEvent,
            this
        );
        EVENT_BUS.on(CUSTOM_EVENTS.HIDE_DIALOG, this.handleDialogClosed, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            EVENT_BUS.off(
                CUSTOM_EVENTS.PLAYER_DEFEATED,
                this.handlePlayerDefeatedEvent,
                this
            );
            EVENT_BUS.off(
                CUSTOM_EVENTS.ENEMY_DEFEATED,
                this.checkForAllEnemiesDefeated,
                this
            );
            EVENT_BUS.off(
                CUSTOM_EVENTS.HIDE_DIALOG,
                this.handleDialogClosed,
                this
            );
        });
    }
    private handlePlayerDefeatedEvent(): void {
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => this.scene.start("GameOver")
        );
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    }
    private checkForAllEnemiesDefeated(): void {
        const enemyGroup = this.objectByAreaId[this.currentAreaId].enemyGroup;
        if (enemyGroup === undefined) {
            return;
        }
        const allRequiredEnemiesAreDefeated = enemyGroup
            .getChildren()
            .every((child) => {
                if (!child.active) {
                    return true;
                }
                if (child instanceof EnimieSlime) {
                    return true;
                }
                return false;
            });
        if (allRequiredEnemiesAreDefeated) {
            //haldeall enimies defeted
        }
    }
    private handleDialogClosed(): void {
        this.scene.resume();
    }

    update(_time: number, delta: number) {
        // Update global time
        globalTime.updateTime(delta);
        // console.log(this.player.depth);
        // this.gameCamera.update(this);
        // console.log(this.player.x, this.player.y);
    }
}
