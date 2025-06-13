import State from '../core/State';
import {Assets, Sprite} from 'pixi.js';

export default class MainGame extends State {
    constructor(name) {
        super(name);

        this._id = null;
    }

    enter(data = {}) {
        this._id = data.id;

        this._createComponents();
        this._callNextWave();
        this._addListeners();
        this._resize(app.width, app.height);
    }

    _createComponents() {
        this._createBackground();
    }

    _createBackground() {
        const back= new Sprite(Assets.get(`level_${this._id}`));
        this.addChild(back);
    }

    _callNextWave() {

    }

    _clear() {
        super._clear();
        this._id = null;
    }
}
