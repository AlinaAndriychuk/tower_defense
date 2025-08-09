import {Assets, Sprite, Graphics} from 'pixi.js';
import State from '../core/State';
import EnemyContainer from '../components/EnemyContainer';
import HUD from '../components/HUD';
import WaveController from '../controllers/WaveController';
import Events from '../constants/Events';
import PlayerStats from '../core/PlayerStats';
import DefenderCardContainer from '../components/DefenderCardContainer';
import DefenderContainer from '../components/DefenderContainer';
import config from '../config';
import Styles from '../constants/Styles';
import utils from '../helpers/utils';

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
        this._disabledCells = [];
        this._occupiedCells = [];
    }

    enter(levelConfig = {}) {
        this._levelConfig = levelConfig;
        super.enter(levelConfig);
        this._callNextWave();
    }

    _createComponents() {
        this._createBackground();
        this._createDividers();
        this._createEnemyContainer();
        this._createDefenderContainer();
        this._createHUD();
        this._createPlayerStats();
        this._createCardContainer();
        this._setDisabledCells();
    }

    _createBackground() {
        this.addChild(new Sprite(Assets.get(`level_${this._levelConfig.id}`)));
    }

    _createDividers() {
        const graphics = new Graphics();
        graphics.setStrokeStyle(Styles.LEVEL.DIVIDER);

        for (let x = 0; x <= this.width; x += config.cell.width) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.height);
        }

        for (let y = 0; y <= this.height; y += config.cell.height) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.width, y);
        }

        graphics.stroke()
        this.addChild(graphics);
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

    _setDisabledCells() {
        this._levelConfig.path.forEach((pos, index) => {
            const currentCellPos = this._getCellPos(pos);

            if (index) {
                const prevCellPos = this._getCellPos(this._levelConfig.path[index - 1]);
                let horizontalDifference = currentCellPos.x - prevCellPos.x;
                let verticalDifference =  currentCellPos.y - prevCellPos.y;

                while (horizontalDifference) {
                    horizontalDifference = this._bringToZero(horizontalDifference);
                    this._disabledCells.push({x: currentCellPos.x - horizontalDifference, y: currentCellPos.y});
                }
                while (verticalDifference) {
                    verticalDifference = this._bringToZero(verticalDifference);
                    this._disabledCells.push({x: currentCellPos.x, y: currentCellPos.y - verticalDifference});
                }
            } else {
                this._disabledCells.push(currentCellPos);
            }
        });
    }

    _bringToZero(num) {
        if (num > 0) return num - 1;
        if (num < 0) return num + 1;
        return num;
    }

    _addListeners() {
        super._addListeners();
        app.on(Events.SPAWN_DEFENDER, this._spawnDefender, this);
    }

    async _spawnDefender({type = '', event}) {
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on('pointermove', this._moveDefender, this);
        this.once('pointerup', () => {
            this.once('pointerdown', this._placeDefender, this);
        }, this);

        const {x, y} =  this._getPossibleDefenderLocalPos(event);
        this._defenderContainer.spawnDefender(type, x, y);
    }

    _moveDefender(event) {
        const {x, y} =  this._getPossibleDefenderLocalPos(event);
        this._defenderContainer.moveDefender(x, y);
    }

    _getPossibleDefenderLocalPos(event) {
        const globalPos = event.global;
        const localPos =  this.toLocal(globalPos);
        const {x, y} = this._getCellPos(localPos);

        if (this._disabledCells.some(cell => cell.x === x && cell.y === y)) {
            this.off('pointerdown', this._placeDefender, this);
        } else {
            // this.once('pointerup', () => {
            //     console.log('pointerdown');
            //     this.on('pointerdown', this._placeDefender, this);
            // }, this);
        }

        return this._snapToCellCenterBottom(localPos.x, localPos.y);
    }

    _getCellPos({x, y}) {
        const cellX = Math.floor(x / config.cell.width);
        const cellY = Math.floor(y / config.cell.height);
        return {x: cellX, y: cellY};
    }

    _snapToCellCenterBottom(x = 0, y = 0) {
        const snappedX = Math.floor(x / config.cell.width) * config.cell.width + config.cell.width / 2;
        const snappedY = Math.floor(y / config.cell.height + 1) * config.cell.height;
        return { x: snappedX, y: snappedY };
    }

    _placeDefender() {
        this.eventMode = 'passive';
        this.cursor = 'default';
        this.off('pointermove', this._moveDefender, this);
        this.off('pointerdown', this._placeDefender, this);
    }

    _removeListeners() {
        super._removeListeners();
        app.off(Events.SPAWN_DEFENDER, this._spawnDefender, this);
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
        this._occupiedCells = [];
    }
}
