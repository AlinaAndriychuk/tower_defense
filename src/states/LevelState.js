import {Assets, Sprite} from 'pixi.js';
import State from '../core/State';
import EnemyContainer from '../components/EnemyContainer';
import HUD from '../components/HUD';
import WaveController from '../controllers/WaveController';
import Events from '../constants/Events';
import PlayerStats from '../core/PlayerStats';

export default class LevelState extends State {
    constructor(name = '') {
        super(name);

        this._levelConfig = null;
        this._currentWaveId = null;
        this._enemyManager = null;
        this._hud = null;
        this._playerStats = null;
        this._wave = null;
    }

    enter(levelConfig = {}) {
        this._levelConfig = levelConfig;
        super.enter(levelConfig);
        this._callNextWave();
    }

    _createComponents() {
        this._createBackground();
        this._createEnemyContainer();
        this._createHUD();
        this._createPlayerStats();
    }

    _createBackground() {
        this.addChild(new Sprite(Assets.get(`level_${this._levelConfig.id}`)));
    }

    _createEnemyContainer() {
        this._enemyContainer = new EnemyContainer();
        this.addChild(this._enemyContainer);
    }

    _createHUD() {
        this._hud = this.addChild(new HUD());
    }

    _createPlayerStats() {
        this._playerStats = new PlayerStats(this._levelConfig.coins, this._levelConfig.lives);
    }

    _callNextWave() {
        this._setCurrentWaveId();
        const waveConfig = this._levelConfig.waves[this._currentWaveId];

        app.emit(Events.UPDATE_STATS, {
            waveNumber: this._currentWaveId + 1,
            waveTimer: waveConfig.duration,
        });

        this._wave = new WaveController(this._enemyContainer, waveConfig, this._levelConfig.path);
    }

    _setCurrentWaveId() {
        if (this._currentWaveId) {
            this._currentWaveId++;
        } else {
            this._currentWaveId = 0;
        }
    }

    _resize(width = 0, height = 0) {
        super._resize(width, height);
        this._hud.resize(width, height);
    }

    _clear() {
        super._clear();
        this._levelConfig = null;
        this._currentWaveId = null;
        this._enemyManager = null;
        this._hud = null;
        this._wave = null;
    }
}
