import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { GridEngine } from "grid-engine";
import { GameScene } from "../types/scenes";
import { setupLayers, GameLayers, setupDepths } from "./GameScene/layers";
import { setupCamera, GameCamera } from "./GameScene/camera";
import { setupControls } from "./GameScene/controls";
import { spawnCrystals } from "./GameScene/crystals";
import { setupFountainStone } from "./GameScene/fountain";

export class Game extends Scene implements GameScene {
    public tilemap: Phaser.Tilemaps.Tilemap;
    private layers: GameLayers;
    private gameCamera: GameCamera;
    public player: Player;
    public gridEngine!: GridEngine;

    constructor() {
        super("Game");
    }

    create() {
        this.tilemap = this.make.tilemap({ key: "game-map" });
        this.layers = setupLayers(this);
        this.setupPlayer();
        setupDepths(this.layers);

        setupFountainStone(this);

        this.gameCamera = setupCamera(this);
        setupControls(this, this.gameCamera);

        spawnCrystals(0.9, this);

        // Remove the gameMessage initialization

        EventBus.emit("current-scene-ready", this);
    }

    private setupPlayer() {
        this.player = new Player(this, 10, 10);
        const gridEngineConfig = {
            characters: [this.player.getGridEngineConfig()],
        };

        this.gridEngine.create(this.tilemap, gridEngineConfig);
        this.player.setupMovementControls();
    }

    update() {
        this.gameCamera.update(this);
    }
}
