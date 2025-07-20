import {Graphics, Container} from 'pixi.js';
import config from '../config';
import Events from '../constants/Events';

export default class HUD extends Container {
    constructor() {
        super();

        this._init();
    }

    _init() {
        this._createComponents();
        this._addListeners();
        this._resize(app.width, app.height);
    }

    _addListeners() {
        app.on(Events.RESIZE, this._resize, this);
    }

    _removeListeners() {
        app.off(Events.RESIZE, this._resize, this);
    }

    _createComponents() {
        this._createBackground();
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.hud.width, config.hud.height)
            .fill({ color: config.hud.color });
        graphics.alpha = config.hud.alpha;
        this.addChild(graphics);
    }

    _resize(width = 0, height = 0) {
        this.position.set(width / 2, height / 2);
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._removeListeners();
        this.removeFromParent();
        super.destroy({children: true});
    }
}