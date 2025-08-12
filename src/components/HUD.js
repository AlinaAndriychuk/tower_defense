import {Graphics, Container, Text} from 'pixi.js';
import config from '../config';
import Styles from '../constants/Styles';
import i18n from '../helpers/i18n';
import Events from '../constants/Events';

export default class HUD extends Container {
    constructor() {
        super();

        this._coinsText = null;
        this._livesText = null;
        this._waveNumberText = null;
        this._waveTimerText = null;
        this._waveTimer = 0;

        this._init();
    }

    _init() {
        this._createComponents();
        this._addListeners();
    }

    _createComponents() {
        this._createBackground();
        this._createCoinsText();
        this._createLivesText();
        this._createWaveNumberText();
        this._createWaveTimerText();
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.hud.width, config.hud.height)
            .fill({ color: config.hud.color });
        graphics.alpha = config.hud.alpha;
        this.addChild(graphics);
    }

    _createCoinsText() {
        const text = new Text({text: i18n.get('COINS'), style: Styles.DEFAULT.TITLE});
        text.y = config.hud.stats.coins.y;
        text.x = config.hud.stats.x;

        this._coinsText = new Text({text: '0', style: Styles.DEFAULT.VALUE});
        this._coinsText.anchor.x = 1;
        this._coinsText.x = this.width - config.hud.stats.x;
        this._coinsText.y = config.hud.stats.coins.y;
        this.addChild(text, this._coinsText);
    }

    _createLivesText() {
        const text = new Text({text: i18n.get('LIVES'), style: Styles.DEFAULT.TITLE});
        text.y = config.hud.stats.lives.y;
        text.x = config.hud.stats.x;

        this._livesText = new Text({text: '0', style: Styles.DEFAULT.VALUE});
        this._livesText.anchor.x = 1;
        this._livesText.x = this.width - config.hud.stats.x;
        this._livesText.y = config.hud.stats.lives.y;
        this.addChild(text, this._livesText);
    }

    _createWaveNumberText() {
        const text = new Text({text: i18n.get('WAVE'), style: Styles.DEFAULT.TITLE});
        text.y = config.hud.stats.waveNumber.y;
        text.x = config.hud.stats.x;

        this._waveNumberText = new Text({text: '0', style: Styles.DEFAULT.VALUE});
        this._waveNumberText.anchor.x = 1;
        this._waveNumberText.x = this.width - config.hud.stats.x;
        this._waveNumberText.y = config.hud.stats.waveNumber.y;
        this.addChild(text, this._waveNumberText);
    }

    _createWaveTimerText() {
        const text = new Text({text: i18n.get('NEXT_WAVE'), style: Styles.DEFAULT.TITLE});
        text.y = config.hud.stats.waveTimer.y;
        text.x = config.hud.stats.x;

        this._waveTimerText = new Text({text: this._formatTime(this._waveTimer), style: Styles.DEFAULT.VALUE});
        this._waveTimerText.anchor.x = 1;
        this._waveTimerText.x = this.width - config.hud.stats.x;
        this._waveTimerText.y = config.hud.stats.waveTimer.y;
        this.addChild(text, this._waveTimerText);
    }

    _updateWaveTimer({deltaMS}) {
        this._waveTimer = Math.max(this._waveTimer - deltaMS / 1000, 0);
        this._waveTimerText.text = this._formatTime(this._waveTimer);
        if (this._waveTimer <= 0) app.ticker.remove(this._updateWaveTimer, this);
    }

    _formatTime(sec = 0) {
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        const ms = Math.floor((sec % 1) * 100).toString().padStart(2, '0');
        return `${m}:${s}:${ms}`;
    }

    _addListeners() {
        app.on(Events.UPDATE_WAVE_STATS, this._updateWaveStats, this);
        app.on(Events.COINS_UPDATED, this._updateCoins, this);
        app.on(Events.LIVES_UPDATED, this._updateLives, this);
    }

    _updateWaveStats(waveNumber = 0, waveTimer = 0) {
        this._waveNumberText.text = waveNumber;
        this._waveTimer = waveTimer;
        app.ticker.remove(this._updateWaveTimer, this);
        app.ticker.add(this._updateWaveTimer, this);
    }

    _updateCoins(coins = 0) {
        this._coinsText.text = coins;
    }

    _updateLives(lives = 0) {
        this._livesText.text = lives;
    }

    _removeListeners() {
        app.off(Events.UPDATE_WAVE_STATS, this._updateWaveStats, this);
        app.off(Events.COINS_UPDATED, this._updateCoins, this);
        app.off(Events.LIVES_UPDATED, this._updateLives, this);
    }

    resize(width = 0, height = 0) {
        this.x = Math.max((this.parent.width - width) / 2 / this.parent.scale.x, 0);
        this.y = Math.max((this.parent.height - height) / 2 / this.parent.scale.y, 0);
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._clear();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _clear() {
        this._removeListeners();
        this._coinsText = null;
        this._livesText = null;
        this._waveNumberText = null;
        this._waveTimerText = null;
        this._waveTimer = null;
    }
}