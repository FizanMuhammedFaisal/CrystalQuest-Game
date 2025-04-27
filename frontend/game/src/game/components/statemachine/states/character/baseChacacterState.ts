import { CharactrerGameObject } from "../../../gameobject/common/characterGameObject";
import { State, StateMachine } from "../../statemachine";

export abstract class BaseCharacterState implements State {
    protected _gameObject: CharactrerGameObject;
    protected _stateMachine: StateMachine;
    private _name: string;
    constructor(name: string, gameObeject: CharactrerGameObject) {
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
