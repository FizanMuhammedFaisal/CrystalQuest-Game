import { EventBus } from "./EventBus";

export class TimeManager {
    private static instance: TimeManager;
    private _timeValue: number = 0;
    private _isNight: boolean = false;

    // Time of day as a value between 0 (noon) and 1 (midnight)
    public get normalizedTime(): number {
        return Math.abs(Math.sin(this._timeValue));
    }

    public get isNight(): boolean {
        return this._isNight;
    }

    public updateTime(delta: number) {
        this._timeValue += 0.0005 * delta;
        const wasNight = this._isNight;
        this._isNight = this.normalizedTime > 0.5;

        // Emit event when day/night changes
        if (wasNight !== this._isNight) {
            EventBus.emit("dayNightChanged", this._isNight);
        }

        // Emit continuous time update
        EventBus.emit("timeUpdated", this.normalizedTime);
    }

    public static getInstance(): TimeManager {
        if (!TimeManager.instance) {
            TimeManager.instance = new TimeManager();
        }
        return TimeManager.instance;
    }
}

export const globalTime = TimeManager.getInstance();
