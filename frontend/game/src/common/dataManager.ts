import { PLAYER_START_MAX_HEALTH } from "../config";
import { LevelName } from "../game/types/types";
import { LEVEL_NAME } from "./common";
import {
    CUSTOM_EVENTS,
    EVENT_BUS,
    PLAYER_HEALTH_UPDATE_TYPE,
    PlayerHealthUpdated,
    PlayerHealthUpdateType,
} from "./eventbus";

export type PlayerData = {
    currentHealth: number;
    maxHealth: number;
    currentArea: {
        levelName: LevelName;
        startAreaId: number;
        startPassageId: number;
    };
    areaDetails: {
        [key in LevelName]: {
            //     [key: number]: {
            //         passages: {
            //             [key: number]: {
            //                 targetPassageId: number;
            //                 targetAreaId: number;
            //                 targetLevel: LevelName;
            //             };
            //         };
            //     };
            bossDefeated?: boolean;
        };
    };
};

export class DataManager {
    private static _instance: DataManager;
    private data: PlayerData;

    private constructor() {
        if (localStorage.getItem("playerData")) {
            this.data = JSON.parse(localStorage.getItem("playerData")!);
            return;
        }
        this.data = {
            currentHealth: PLAYER_START_MAX_HEALTH,
            maxHealth: PLAYER_START_MAX_HEALTH,
            currentArea: {
                levelName: LEVEL_NAME.GROUND,
                startAreaId: 1,
                startPassageId: 1,
            },
            areaDetails: {
                [LEVEL_NAME.GROUND]: {
                    bossDefeated: false,
                },
            },
        };
    }
    public static get instance(): DataManager {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }
    get playerData(): PlayerData {
        return { ...this.data };
    }
    set playerData(data: PlayerData) {
        this.data = { ...data };
    }
    public updateAreaData(
        levelName: LevelName,
        startAreaId: number,
        startPassageId: number
    ): void {
        this.data.currentArea.levelName = levelName;
        this.data.currentArea.startAreaId = startAreaId;
        this.data.currentArea.startPassageId = startPassageId;
    }
    public resetPlayerHealthToMin(): void {
        this.playerData.currentHealth = PLAYER_START_MAX_HEALTH;
    }
    public updatePlayerCurrentHealth(health: number): void {
        if (health === this.playerData.currentHealth) {
            return;
        }
        let healthUpdateType: PlayerHealthUpdateType =
            PLAYER_HEALTH_UPDATE_TYPE.DECREASE;
        if (health > this.playerData.currentHealth) {
            healthUpdateType = PLAYER_HEALTH_UPDATE_TYPE.INCREASE;
        }
        const dataToPass: PlayerHealthUpdated = {
            previousHealth: this.playerData.currentHealth,
            currentHealth: health,
            type: healthUpdateType,
        };
        EVENT_BUS.emit(CUSTOM_EVENTS.PLAYER_HEALTH_UPDATED, dataToPass);
        this.playerData.currentHealth = health;
    }
    public saveProgress() {
        console.log("saving");
        localStorage.setItem("playerData", JSON.stringify(this.playerData));
    }
}
