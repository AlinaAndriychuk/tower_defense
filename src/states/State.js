import {Container} from 'pixi.js';
import eventBus from '../core/EventBus';
import Events from '../constants/Events';

export default class State extends Container {
    constructor(name) {
        super();
        this._stateName = name;
    }

    enter() {
        this._createComponents();
        this._addListeners();
    }

    exit() {
        this.removeFromParent();
        this.destroy({children: true});
    }

    _createComponents() {

    }

    _addListeners() {
        eventBus.on(Events.RESIZE, this._resize.bind(this));
    }

    _resize(width, height) {
        this._scaleToCover(this, width, height);
    }

    _scaleToCover(target, width, height) {
        const bounds = target.getLocalBounds();
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        const scale = Math.max(scaleX, scaleY);

        target.scale.set(scale);

        target.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        target.position.set(width / 2, height / 2);
    }

    get stateName() {
        return this._stateName;
    }
}