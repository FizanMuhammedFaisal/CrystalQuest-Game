import { Scene } from "phaser";
import { Player } from "../entities/Player";
import { GridEngine } from "grid-engine";
import { GameScene } from "../types/scenes";
import { setupLayers, GameLayers, setupDepths } from "./GameScene/layers";
import { setupCamera, GameCamera } from "./GameScene/camera";
import { setupControls } from "./GameScene/controls";
import { spawnCrystals } from "./GameScene/crystals";
import { setupFountainStone } from "./GameScene/fountain";
import { globalTime } from "../TimeManager";
import { KeyboardComponent } from "../components/input/keyboardComponent";

export class Game extends Scene implements GameScene {
    public tilemap: Phaser.Tilemaps.Tilemap;
    private layers: GameLayers;
    private gameCamera: GameCamera;
    public player: Player;
    public gridEngine!: GridEngine;
    private controls!: KeyboardComponent;
    constructor() {
        super("Game");
    }

    create() {
        // 1. Create tilemap first
        this.tilemap = this.make.tilemap({ key: "game-map" });

        this.controls = new KeyboardComponent(this.input.keyboard);

        // 2. Setup layers
        this.layers = setupLayers(this);
        this.setupPlayer();
        setupDepths(this.layers);

        setupFountainStone(this);

        this.gameCamera = setupCamera(this);
        setupControls(this, this.gameCamera);

        spawnCrystals(0.9, this);

        // Add the day/night shader
        this.cameras.main.setPostPipeline("DayNight");
    }

    private setupPlayer() {
        this.player = new Player({
            scene: this,
            positions: { x: 20, y: 60 },
            assetKey: "PLAYER",
            controls: this.controls,
        });
        const gridEngineConfig = {
            characters: [this.player.getGridEngineConfig()],
        };

        this.gridEngine.create(this.tilemap, gridEngineConfig);
    }

    update(_time: number, delta: number) {
        // Update global time
        globalTime.updateTime(delta);

        this.gameCamera.update(this);
    }
}
