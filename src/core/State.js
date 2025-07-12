import {Container} from 'pixi.js';
import eventBus from './EventBus';
import Events from '../constants/Events';
import utils from '../helpers/utils';
import config from '../config';

export default class State extends Container {
    constructor(name) {
        super();
        this._stateName = name;
    }

    enter(data = {}) {
        this._createComponents();
        this._addListeners();
        this._resize(app.width, app.height);
    }

    exit() {
        this._clear();
        this._removeListeners();
        this.removeFromParent();
        this.destroy({children: true});
    }

    _createComponents() {

    }

    _addListeners() {
        eventBus.on(Events.RESIZE, this._resize, this);
    }

    _clear() {

    }

    _removeListeners() {
        eventBus.removeAllByContext(this);
    }

    _resize(width, height) {
        utils.scaleToCover(this, width, height, config.state.safeWidth, config.state.safeHeight);
        utils.centralize(this, width, height);
    }

    get stateName() {
        return this._stateName;
    }
}