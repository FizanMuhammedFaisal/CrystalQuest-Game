export const EVENT_BUS = new Phaser.Events.EventEmitter();
export const CUSTOM_EVENTS = {
    PLAYER_DEFEATED: "PLAYER_DEFEATED",
    ENEMY_DEFEATED: "ENEMY_DEFEATED",
    PLAYER_HEALTH_UPDATED: "PLAYER_HEALTH_UPDATED",
    SHOW_DIALOG: "SHOW_DIALOG",
    HIDE_DIALOG: "HIDE_DIALOG",
};
export const PLAYER_HEALTH_UPDATE_TYPE = {
    INCREASE: "INCREASE",
    DECREASE: "DECREASE",
} as const;
export type PlayerHealthUpdateType = keyof typeof PLAYER_HEALTH_UPDATE_TYPE;

export type PlayerHealthUpdated = {
    currentHealth: number;
    previousHealth: number;
    type: PlayerHealthUpdateType;
};
