import { GridEngine } from "grid-engine";
import { Scene } from "phaser";

export interface GameScene extends Scene {
    gridEngine: GridEngine;
}