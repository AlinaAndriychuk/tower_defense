import {Container} from 'pixi.js';
import eventBus from './EventBus';
import Events from '../constants/Events';
import utils from '../helpers/utils';
import config from '../config';

export default class State extends Container {
    constructor(name = '') {
        super();
        this._stateName = name;
    }

    enter(stateConfig = {}) {
        this._createComponents();
        this._addListeners();
        this._setPivot();
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
        this._stateName = '';
    }

    _removeListeners() {
        eventBus.removeAllByContext(this);
    }

    _setPivot() {
        this.pivot.set(config.state.pivot.x, config.state.pivot.y);
    }

    _resize(width = 0, height = 0) {
        utils.scaleToCover({
            target: this,
            width,
            height,
            safeWidth: config.state.safeWidth,
            safeHeight: config.state.safeHeight,
            originWidth: config.state.width,
            originHeight: config.state.height,
        });
        this.position.set(width / 2, height / 2);
    }

    get stateName() {
        return this._stateName;
    }
}