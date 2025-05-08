import {Container} from 'pixi.js';

export default class State extends Container {
    constructor(name) {
        super();
        this._stateName = name;
    }

    enter() {

    }

    exit() {
        this.removeFromParent();
        this.destroy({children: true});
    }

    get stateName() {
        return this._stateName;
    }
}