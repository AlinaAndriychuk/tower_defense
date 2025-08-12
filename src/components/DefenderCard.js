import config from '../config';
import {Assets, Container, Sprite, Text} from 'pixi.js';
import i18n from '../helpers/i18n';
import Styles from '../constants/Styles';
import Events from '../constants/Events';

export default class DefenderCard extends Container {
    constructor(type = '') {
        super();
        this._type = type;
        this._characterConfig = config.characters[this._type];
        this._sprite = null;
        this._isDisabled = true;

        this._init();
    }

    _init() {
        this._createComponents();
        this._addListeners();
        this._enable();
    }

    _createComponents() {
        this._createCharacter();
        this._createText();
    }

    _createCharacter() {
        const sheetName = `${this._type}_idle`;
        const sheet = Assets.cache.get(sheetName);
        const texture = sheet.textures[`${this._type}_idle_00.png`];
        this._sprite = new Sprite(texture);
        this._sprite.scale.set(config.card.character.scale);
        this.addChild(this._sprite);
    }

    _createText() {
        const title = new Text({text: i18n.get('COST'), style: Styles.DEFAULT.TITLE});
        title.y = config.card.text.y;
        title.x = config.card.text.x;

        const value = new Text({text: this._characterConfig.coins, style: Styles.DEFAULT.VALUE});
        value.anchor.x = 1;
        value.x = this.width - config.card.text.x;
        value.y = config.card.text.y;
        this.addChild(title, value);
    }

    _addListeners() {
        this.on('pointerdown', this._buyDefender, this);
    }

    _buyDefender(event) {
        app.emit(Events.SPAWN_DEFENDER, {type: this._type, event});
    }

    updateState(coins = 0) {
        if (this._characterConfig.coins > coins) {
            this._disable();
        } else {
            this._enable();
        }
    }

    _disable() {
        if (this._isDisabled) return;

        this._isDisabled = true;
        this.eventMode = 'passive';
        this.cursor = 'default';
        this._sprite.alpha = config.card.disabled.alpha;
    }

    _enable() {
        if (!this._isDisabled) return;

        this._isDisabled = false;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this._sprite.alpha = 1;
    }

    _removeListeners() {
        this.removeAllListeners();
    }

    destroy() {
        this._clear();
        super.destroy({children: true});
    }

    _clear() {
        this._removeListeners();
        this._type = null;
        this._sprite = null;
        this._isDisabled = null;
    }
}