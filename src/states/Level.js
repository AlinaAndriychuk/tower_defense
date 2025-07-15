import State from '../core/State';
import {Assets, Sprite} from 'pixi.js';
import Wave from '../components/Wave';

export default class Level extends State {
    constructor(name) {
        super(name);

        this._id = null;
        this._currentWaveId = null;
        this._wavesConfig = [];
        this._path = [];
    }

    enter(levelConfig = {}) {
        this._id = levelConfig.id;
        this._wavesConfig = levelConfig.waves;
        this._path = levelConfig.path;

        this._createComponents();
        this._callNextWave();
        this._addListeners();
        this._setPivot();
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
        this._setCurrentWaveId();
        const wave = new Wave(this._wavesConfig[this._currentWaveId], this._path);
    }

    _setCurrentWaveId() {
        if (this._currentWaveId) {
            this._currentWaveId++;
        } else {
            this._currentWaveId = 0;
        }
    }

    _clear() {
        super._clear();
        this._id = null;
        this._currentWaveId = null;
        this._wavesConfig = [];
        this._path = [];
    }
}
