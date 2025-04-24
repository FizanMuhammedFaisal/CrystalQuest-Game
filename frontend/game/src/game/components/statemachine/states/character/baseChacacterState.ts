import { Player } from "../../../../entities/Player";
import { State, StateMachine } from "../../statemachine";

export abstract class BaseCharacterState implements State {
    protected _gameObject: Player;
    protected _stateMachine: StateMachine;
    private _name: string;
    constructor(name: string, gameObeject: Player) {
        this._name = name;
        this._gameObject = gameObeject;
    }
    get name(): string {
        return this._name;
    }
    set stateMachine(stateMachine: StateMachine) {
        this._stateMachine = stateMachine;
    }
}
