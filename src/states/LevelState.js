import {Assets, Sprite} from 'pixi.js';
import State from '../core/State';
import EnemyContainer from '../components/EnemyContainer';
import HUD from '../components/HUD';
import WaveController from '../controllers/WaveController';
import Events from '../constants/Events';
import PlayerStats from '../core/PlayerStats';
import DefenderCardContainer from '../components/DefenderCardContainer';
import DefenderContainer from '../components/DefenderContainer';

export default class LevelState extends State {
    constructor(name = '') {
        super(name);

        this._levelConfig = null;
        this._currentWaveId = null;
        this._enemyContainer = null;
        this._defenderContainer = null;
        this._hud = null;
        this._playerStats = null;
        this._wave = null;
        this._cardContainer = null;
    }

    enter(levelConfig = {}) {
        this._levelConfig = levelConfig;
        super.enter(levelConfig);
        this._callNextWave();
    }

    _createComponents() {
        this._createBackground();
        this._createEnemyContainer();
        this._createDefenderContainer();
        this._createHUD();
        this._createPlayerStats();
        this._createCardContainer();
    }

    _createBackground() {
        this.addChild(new Sprite(Assets.get(`level_${this._levelConfig.id}`)));
    }

    _createEnemyContainer() {
        this._enemyContainer = new EnemyContainer();
        this.addChild(this._enemyContainer);
    }

    _createDefenderContainer() {
        this._defenderContainer = new DefenderContainer();
        this.addChild(this._defenderContainer);
    }

    _createHUD() {
        this._hud = this.addChild(new HUD());
    }

    _createPlayerStats() {
        this._playerStats = new PlayerStats(this._levelConfig.coins, this._levelConfig.lives);
    }

    _createCardContainer() {
        this._cardContainer = this.addChild(new DefenderCardContainer());
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

    _addListeners() {
        super._addListeners();
        app.on(Events.PLACE_DEFENDER, this._placeDefender, this);
    }

    _placeDefender(type = '') {
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointermove', this._moveDefender, this);
        const defender = this._defenderContainer.spawnDefender(type, 300, 300);
    }

    _moveDefender(event) {
        const globalPos = event.global;
        const localPos =  this.toLocal(globalPos);
        this._defenderContainer.moveDefender(localPos);
    }

    _removeListeners() {
        super._removeListeners();
        app.off(Events.PLACE_DEFENDER, this._placeDefender, this);
    }

    _resize(width = 0, height = 0) {
        super._resize(width, height);
        this._hud.resize(width, height);
        this._cardContainer.resize(width, height);
    }

    _clear() {
        super._clear();
        this._levelConfig = null;
        this._currentWaveId = null;
        this._enemyContainer = null;
        this._defenderContainer = null;
        this._hud = null;
        this._playerStats = null;
        this._wave = null;
    }
}
