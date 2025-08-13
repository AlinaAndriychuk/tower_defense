import {Graphics, Container, Text} from 'pixi.js';
import config from '../config';
import Styles from '../constants/Styles';
import i18n from '../helpers/i18n';
import Events from '../constants/Events';
import utils from '../helpers/utils';

const HUDConfig = [
    {
        title: `${i18n.get('COINS')}:`,
        y: config.hud.stats.coins.y,
        property: '_coinsText',
    },
    {
        title: `${i18n.get('LIVES')}:`,
        y: config.hud.stats.lives.y,
        property: '_livesText',
    },
    {
        title: `${i18n.get('WAVE')}:`,
        y: config.hud.stats.waveNumber.y,
        property: '_waveNumberText',
    },
    {
        title: `${i18n.get('NEXT_WAVE')}:`,
        y: config.hud.stats.waveTimer.y,
        property: '_waveTimerText',
    }
];

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
        HUDConfig.forEach(componentData => this._createComponent(componentData));
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.hud.width, config.hud.height)
            .fill({ color: config.hud.color });
        graphics.alpha = config.hud.alpha;
        this.addChild(graphics);
    }

    _createComponent({title = '', y = 0, property}) {
        const text = new Text({text: title, style: Styles.DEFAULT.TITLE});
        text.y = y;
        text.x = config.hud.stats.x;

        this[property] = new Text({text: '', style: Styles.DEFAULT.VALUE});
        this[property].anchor.x = 1;
        this[property].x = this.width - config.hud.stats.x;
        this[property].y = y;
        this.addChild(text, this[property]);
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
        utils.positionTopRight(this, width, height);
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