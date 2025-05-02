import { LevelName } from "../../types/types";

type AreaInventory = {
    map: boolean;
};
type ItemInventory = {
    sword: boolean;
};
export type InventoryData = {
    general: ItemInventory;
    area: { [key in LevelName]: AreaInventory };
};
export class InventoryManager {
    private static _instance: InventoryManager;

    private _generalInventory: ItemInventory;
    private _areaInventory: { [key in LevelName]: AreaInventory };
    private constructor() {
        // Private constructor to prevent instantiation from outside the class
        this._generalInventory = {
            sword: true,
        };
    }
    public static get instance(): InventoryManager {
        if (!InventoryManager._instance) {
            InventoryManager._instance = new InventoryManager();
        }
        return InventoryManager._instance;
    }
    get data(): InventoryData {
        return {
            general: { ...this._generalInventory },
            area: { ...this._areaInventory },
        };
    }
    set data(data: InventoryData) {
        this._generalInventory = { ...data.general };
        this._areaInventory = { ...data.area };
    }
}
