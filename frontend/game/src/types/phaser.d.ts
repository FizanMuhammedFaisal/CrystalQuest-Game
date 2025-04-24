import "phaser";
import { BaseGameobjectComponent } from "../game/components/gameobject/baseGameobjectComponent";

declare module "phaser" {
    namespace GameObjects {
        interface Sprite {
            [key: string]: BaseGameobjectComponent | number | string | unknown;
            // This tells TypeScript: "properties can be components or other common types"
        }
        interface Image {
            [key: string]: BaseGameobjectComponent | number | string | unknown;
        }
    }
}
