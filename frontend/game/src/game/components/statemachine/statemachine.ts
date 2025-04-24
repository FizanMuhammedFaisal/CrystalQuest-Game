import { ENABLE_LOGGING } from "../../../common/config";

export interface State {
    stateMachine: StateMachine;
    name: string;
    onEnter?: (args?: unknown[]) => void;
    onUpdate?: (args?: unknown[]) => void;
}

export class StateMachine {
    private id: string;
    private states: Map<string, State>;
    private currentState: State | undefined;
    private isChangingState: boolean;
    private changingStateQueue: { state: string; args: unknown[] }[];
    constructor(id?: string) {
        if (id === undefined) {
            this.id = Phaser.Math.RND.uuid();
        } else {
            this.id = id;
        }
        this.states = new Map();
        this.currentState = undefined;
        this.isChangingState = false;
        this.changingStateQueue = [];
    }
    public update(): void {
        const queuedState = this.changingStateQueue.shift();
        if (queuedState !== undefined) {
            this.setState(queuedState.state, ...queuedState.args);
            return;
        }
        if (this.currentState && this.currentState.onUpdate) {
            this.currentState.onUpdate();
        }
    }
    public addState(state: State): void {
        state.stateMachine = this;
        this.states.set(state.name, state);
    }
    public setState(name: string, ...args: unknown[]): void {
        const methordName = "setState";
        if (!this.states.has(name)) {
            console.warn(
                `State ${StateMachine.name}-${this.id}:${methordName} tried to change to ${name} but it does not exist`
            );
            return;
        }
        if (this.isCurrentState(name)) {
            return;
        }
        if (this.isChangingState) {
            this.changingStateQueue.push({ state: name, args });
            return;
        }
        this.isChangingState = true;
        this.log(
            methordName,
            `Changing from ${this.currentState?.name ?? "none"} to ${name}`
        );
        this.currentState = this.states.get(name);
        if (this.currentState?.onEnter) {
            this.currentState.onEnter(args);
        }
        this.isChangingState = false;
    }
    private isCurrentState(name: string): boolean {
        if (!this.currentState) {
            return false;
        }
        return this.currentState?.name === name;
    }
    private log(methordName: string, message: string): void {
        if (!ENABLE_LOGGING) {
            return;
        }
        console.log(
            `State ${StateMachine.name}-${this.id}:${methordName} ${message}`
        );
    }
}
