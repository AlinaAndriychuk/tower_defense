import {Assets, Sprite, Graphics} from 'pixi.js';
import State from '../core/State';
import EnemyContainer from '../components/EnemyContainer';
import HUD from '../components/HUD';
import WaveController from '../controllers/WaveController';
import Events from '../constants/Events';
import PlayerStats from '../core/PlayerStats';
import DefenderCardContainer from '../components/defender/DefenderCardContainer';
import DefenderContainer from '../components/defender/DefenderContainer';
import config from '../config';
import Styles from '../constants/Styles';
import DefenderMenu from '../components/defender/DefenderMenu';

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
        this._defenderMenu = null;
        this._isEnabled = false;
        this._disabledCells = [];
        this._occupiedCells = [];
    }

    enter(levelConfig = {}) {
        this._levelConfig = levelConfig;
        super.enter(levelConfig);
        this._createPlayerStats();
        this._setDisabledCells();
        this._callNextWave();
        app.ticker.add(this._attackEnemies, this);
    }

    _createComponents() {
        this._createBackground();
        this._createDividers();
        this._createEnemyContainer();
        this._createDefenderContainer();
        this._createHUD();
        this._createCardContainer();
        this._createDefenderMenu();
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
        this._playerStats = new PlayerStats();
        app.emit(Events.UPDATE_COINS, this._levelConfig.coins);
        app.emit(Events.UPDATE_LIVES, this._levelConfig.lives);
    }

    _createCardContainer() {
        this._cardContainer = this.addChild(new DefenderCardContainer());
    }

    _createDefenderMenu() {
        this._defenderMenu = this.addChild(new DefenderMenu());
    }

    _attackEnemies() {
        this._defenderContainer.readyDefenders.forEach(defender => {
            const enemiesInRange = this._getEnemiesInRange(defender);
            if (enemiesInRange.length) {
                defender.attack(enemiesInRange);
            }
        });
    }

    _getEnemiesInRange(defender) {
        return this._enemyContainer.enemies.filter(enemy => {
            if (!this._aabbOverlap(defender.position, defender.radiusX, defender.radiusY,
                enemy.position, enemy.radiusX, enemy.radiusY)) {
                return false;
            }

            const dx = enemy.position.x - defender.position.x;
            const dy = enemy.position.y - defender.position.y;

            const nx = dx / (defender.radiusX + enemy.radiusX);
            const ny = dy / (defender.radiusY + enemy.radiusY);

            return (nx * nx + ny * ny) <= 1;
        });
    }

    _aabbOverlap(pos1, rx1, ry1, pos2, rx2, ry2) {
        return (
            Math.abs(pos1.x - pos2.x) <= rx1 + rx2 &&
            Math.abs(pos1.y - pos2.y) <= ry1 + ry2
        );
    }

    _callNextWave() {
        this._setCurrentWaveId();
        const waveConfig = this._levelConfig.waves[this._currentWaveId];

        app.emit(Events.UPDATE_WAVE_STATS, this._currentWaveId + 1, waveConfig.duration);
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

    async _spawnDefender({type = '', event}) {
        this._enable();
        this.on('pointermove', this._moveDefender, this);
        this.on('pointerdown', this._buyDefender, this);

        const {x, y} =  this._getPossibleDefenderLocalPos(event);
        this._defenderContainer.spawnDefender(type, x, y);
    }

    _enable() {
        if (this._isEnabled) return;

        this._isEnabled = true;
        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    _disable() {
        if (!this._isEnabled) return;

        this._isEnabled = false;
        this.eventMode = 'passive';
        this.cursor = 'default';
    }

    _moveDefender(event) {
        const pos =  this._getPossibleDefenderLocalPos(event);
        const cell = this._getCellPos(pos);

        if (this._isDisabledCell(cell) || this._isOccupiedCell(cell)) {
            this._defenderContainer.showDefenderDisabled();
        } else {
            this._defenderContainer.showDefenderEnabled();
        }

        this._defenderContainer.moveDefender(pos.x, pos.y);
    }

    _getPossibleDefenderLocalPos(event) {
        const globalPos = event.global;
        const localPos =  this.toLocal(globalPos);
        let {x, y} = this._getCellPos(localPos);

        if (this._levelConfig.cells.start.x > x) {
            localPos.x = this._getLocalPosFromCell({x: this._levelConfig.cells.start.x}).x;
        } else if (this._levelConfig.cells.end.x < x) {
            localPos.x = this._getLocalPosFromCell({x: this._levelConfig.cells.end.x}).x;
        }

        if (this._levelConfig.cells.start.y > y) {
            localPos.y = this._getLocalPosFromCell({y: this._levelConfig.cells.start.y}).y;
        } if (this._levelConfig.cells.end.y < y) {
            localPos.y = this._getLocalPosFromCell({y: this._levelConfig.cells.end.y}).y;
        }

        return this._snapToCellCenterBottom(localPos.x, localPos.y);
    }

    _getCellPos({x, y}) {
        const cellX = Math.floor(x / config.cell.width);
        const cellY = Math.floor(y / config.cell.height);
        return {x: cellX, y: cellY};
    }

    _getLocalPosFromCell({x = 0, y = 0}) {
        const posX = Math.floor(x * config.cell.width);
        const posY = Math.floor(y * config.cell.height);
        return {x: posX, y: posY};
    }

    _snapToCellCenterBottom(x = 0, y = 0) {
        const snappedX = Math.floor(x / config.cell.width) * config.cell.width + config.cell.width / 2;
        const snappedY = Math.floor(y / config.cell.height) * config.cell.height + config.cell.height / 2;
        return { x: snappedX, y: snappedY };
    }

    _buyDefender(event) {
        const pos = this._getPossibleDefenderLocalPos(event);
        const cell = this._getCellPos(pos);

        if (this._isDisabledCell(cell) || this._isOccupiedCell(cell)) {
            return;
        }

        this._disable();
        this._occupiedCells.push(cell);
        this._defenderContainer.buyDefender();
        this.off('pointermove', this._moveDefender, this);
        this.off('pointerdown', this._buyDefender, this);
    }

    _destroyDefender(defender) {
        const cell = this._getCellPos(defender.position);
        const index = this._occupiedCells.findIndex(({x, y}) => cell.x === x && cell.y === y);
        this._occupiedCells.splice(index, 1)
    }

    _isDisabledCell(cell) {
        return this._disabledCells.some(disabledCell => disabledCell.x === cell.x && disabledCell.y === cell.y)
    }

    _isOccupiedCell(cell) {
        return this._occupiedCells.some(disabledCell => disabledCell.x === cell.x && disabledCell.y === cell.y)
    }

    _listenToggleDefenderMenu() {
        if (this._isEnabled) return;

        this._enable();
        this.cursor = 'default';
        this.on('pointerdown', this._toggleDefenderMenu, this);
    }

    _toggleDefenderMenu() {
        app.emit(Events.TOGGLE_DEFENDER_MENU);
        this._disable();
        this.off('pointerdown', this._toggleDefenderMenu, this);
    }

    _addListeners() {
        super._addListeners();
        app.on(Events.SPAWN_DEFENDER, this._spawnDefender, this);
        app.on(Events.DESTROY_DEFENDER, this._destroyDefender, this);
        app.on(Events.TOGGLE_DEFENDER_MENU, this._listenToggleDefenderMenu, this);
    }

    _removeListeners() {
        super._removeListeners();
        app.off(Events.SPAWN_DEFENDER, this._spawnDefender, this);
        app.off(Events.DESTROY_DEFENDER, this._destroyDefender, this);
    }

    _resize(width = 0, height = 0) {
        super._resize(width, height);
        this._hud.resize(width, height);
        this._cardContainer.resize(width, height);
        this._defenderMenu.resize(width, height);
    }

    exit() {
        app.ticker.remove(this._attackEnemies, this);
        super.exit();
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
        this._cardContainer = null;
        this._defenderMenu = null;
        this._isEnabled = null;
        this._disabledCells = null;
        this._occupiedCells = null;
    }
}
