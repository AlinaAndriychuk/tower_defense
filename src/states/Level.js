import State from '../core/State';
import {Assets, Sprite} from 'pixi.js';
import Wave from '../components/Wave';

export default class Level extends State {
    constructor(name) {
        super(name);

        this._id = null;
    }

    enter(data = {}) {
        this._id = data.id;
        this._wavesData = data.waves;
        this._currentWaveId = null;

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
        this._setCurrentWaveId();
        const wave = new Wave(this._wavesData[this._currentWaveId]);
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
        this._currentWaveId = 0;
    }
}
