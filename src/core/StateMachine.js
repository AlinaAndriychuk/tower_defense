import Transitions from '../constants/Transitions';
import eventBus from './EventBus';
import Events from '../constants/Events';

export default class StateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
        this._addListeners();
    }

    addState(name, state) {
        this._states[name] = state;
    }

    _changeState({name = '', data = {}}) {
        if (!this._states[name]) {
            console.error(`State ${name} not added.`);
            return;
        }

        if (this._currentState && !Transitions[this._currentState.stateName].includes(name)) {
            console.error(`Transition from ${this._currentState.stateName} to ${name} not found.`);
            return;
        }

        if (this._currentState) {
            this._currentState.exit();
            this._currentState = null;
        }

        this._currentState = new this._states[name](name);
        app.stage.addChild(this._currentState);
        this._currentState.enter(data);
    }

    _addListeners() {
        eventBus.on(Events.CHANGE_STATE, this._changeState, this);
    }
}