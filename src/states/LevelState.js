import {Assets, Sprite} from 'pixi.js';
import State from '../core/State';
import EnemyContainer from '../components/EnemyContainer';
import HUD from '../components/HUD';
import WaveController from '../controllers/WaveController';

export default class LevelState extends State {
    constructor(name = '') {
        super(name);

        this._id = null;
        this._currentWaveId = null;
        this._enemyManager = null;
        this._wavesConfig = [];
        this._path = [];
    }

    enter(levelConfig = {}) {
        this._id = levelConfig.id;
        this._wavesConfig = levelConfig.waves;
        this._path = levelConfig.path;

        this._createComponents();
        this._createEnemyManager();
        this._callNextWave();
        this._addListeners();
        this._setPivot();
        this._resize(app.width, app.height);
    }

    _createComponents() {
        this._createBackground();
        this._createHUD();
    }

    _createBackground() {
        this.addChild(new Sprite(Assets.get(`level_${this._id}`)));
    }

    _createHUD() {
        this.addChild(new HUD());
    }

    _createEnemyManager() {
        this._enemyContainer = new EnemyContainer();
        this.addChild(this._enemyContainer);
    }

    _callNextWave() {
        this._setCurrentWaveId();
        new WaveController(this._enemyContainer, this._wavesConfig[this._currentWaveId], this._path);
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
        this._enemyManager = null;
        this._wavesConfig = [];
        this._path = [];
    }
}
