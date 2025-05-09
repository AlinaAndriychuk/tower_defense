import Transitions from '../constants/Transitions';

export default class StateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
        this._addListeners();
    }

    addState(name, state) {
        this._states[name] = state;
    }

    changeState(name) {
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
        }

        this._currentState = new this._states[name](name);
        app.stage.addChild(this._currentState);
        this._currentState.enter();
    }

    _addListeners() {

    }
}