import { TiledPassageObject } from "../../../tiled/types";
import { CustomGameObject, Direction } from "../../../types/types";

export class Passage implements CustomGameObject {
    #scene: Phaser.Scene;
    #areaId: number;
    #targetPassageId: number;
    #targetareaId: number;
    #x: number;
    #y: number;
    #targetLevel: string;
    #passageTransitionZone: Phaser.GameObjects.Zone;
    #debugDoorTransitionZone: Phaser.GameObjects.Rectangle | undefined;
    #direction: Direction;
    constructor(
        scene: Phaser.Scene,
        config: TiledPassageObject,
        areaId: number
    ) {
        this.#scene = scene;
        this.#areaId = areaId;
        this.#targetPassageId = config.targetPassageId;
        this.#targetareaId = config.targetAreaId;
        this.#x = config.x;
        this.#y = config.y;
        this.#targetLevel = config.targetLevel;
        this.#direction = config.direction;
        this.#passageTransitionZone = this.#scene.add
            .zone(config.x, config.y, config.width, config.height)
            .setOrigin(0, 1)
            .setName(config.id.toString());
        this.#scene.physics.world.enable(this.#passageTransitionZone);
        this.#debugDoorTransitionZone = this.#scene.add
            .rectangle(
                config.x,
                config.y,
                config.width,
                config.height,
                0x0000ff,
                0.6
            )
            .setOrigin(0, 1);
    }
    public enableObject(): void {
        const body = this.#passageTransitionZone
            .body as Phaser.Physics.Arcade.Body;
        body.enable = true;
        body.checkCollision.none = false; // Allow collision detection
        this.#passageTransitionZone.active = true;
    }
    public disableObject(): void {
        const body = this.#passageTransitionZone
            .body as Phaser.Physics.Arcade.Body;
        body.enable = false;
        body.checkCollision.none = true; // Disable ALL collision detection
        this.#passageTransitionZone.active = false;
    }
    get x(): number {
        return this.#x;
    }
    get y(): number {
        return this.#y;
    }
    get targetPassageId(): number {
        return this.#targetPassageId;
    }
    get targetareaId(): number {
        return this.#targetareaId;
    }
    get areaId(): number {
        return this.#areaId;
    }
    get targetLevel(): string {
        return this.#targetLevel;
    }
    get passageTransitionZone(): Phaser.GameObjects.Zone {
        return this.#passageTransitionZone;
    }
    get direction(): Direction {
        return this.#direction;
    }
}
