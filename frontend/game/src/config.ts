export const CONFIG = {
    baseUrl: "http://localhost:8080",
    assetsPath: "/assets",
};

export default CONFIG;
export const PLAYER_SPEED = 150;
export const ENIMIE_SLIME_SPEED = 90;

export const PLAYER_INVULNARABLE_AFTER_HIT_ANIMATION_DURATION = 500;
export const HURT_PUSH_BACK_DELAY = 100;
export const PLAYER_HURT_PUSH_BACK_SPEED = 50;
export const ENIMIE_SLIME_HURT_PUSH_BACK_SPEED = 50;

export const PLAYER_START_MAX_HEALTH = 30;
export const ENIMIE_SLIME_START_MAX_HEALTH = 3;

export const DEBUG_COLLISION_ALPHA = 0;
export const PLAYER_ATTACK_DAMAGE = 2;

export const TORCH_ENIMIE_SPEED = 70; // Current speed
export const TORCH_ENIMIE_START_MAX_HEALTH = 10; // Current health
export const TORCH_ENIMIE_HURT_PUSH_BACK_SPEED = 20; // Current push back speed
export const ENIMIE_TORCH_DAMAGE = 1; // Current damage

export const TORCH_ENIMIE_DETECTION_RADIUS = 150; // Distance at which enemy detects player
export const TORCH_ENIMIE_ATTACK_RANGE = 60; // Distance at which enemy attacks player
export const TORCH_ENIMIE_ATTACK_COOLDOWN = 1500; // Cooldown between attacks in milliseconds
export const TORCH_ENIMIE_RETURN_THRESHOLD = 250; // Distance at which enemy returns to starting position
