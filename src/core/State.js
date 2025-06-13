import {Container} from 'pixi.js';
import eventBus from './EventBus';
import Events from '../constants/Events';
import utils from '../helpers/utils';

export default class State extends Container {
    constructor(name) {
        super();
        this._stateName = name;
    }

    enter() {
        this._createComponents();
        this._addListeners();
        this._resize(app.width, app.height);
    }

    exit() {
        this._removeListeners();
        this.removeFromParent();
        this.destroy({children: true});
    }

    _createComponents() {

    }

    _addListeners() {
        eventBus.on(Events.RESIZE, this._resize, this);
    }

    _removeListeners() {
        eventBus.removeAllByContext(this);
    }

    _resize(width, height) {
        utils.scaleToCover(this, width, height);
        utils.center(this, width, height);
    }

    get stateName() {
        return this._stateName;
    }
}