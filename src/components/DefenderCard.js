import config from '../config';
import {Assets, Container, Sprite, Text} from 'pixi.js';
import i18n from '../helpers/i18n';
import Styles from '../constants/Styles';
import Events from '../constants/Events';

export default class DefenderCard extends Container {
    constructor(type = '') {
        super();
        this._type = type;

        this._init();
    }

    _init() {
        this._createComponents();
        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    _createComponents() {
        this._createCharacter();
        this._createText();
        this._addListeners();
    }

    _createCharacter() {
        const sheetName = `${this._type}_idle`;
        const sheet = Assets.cache.get(sheetName);
        const texture = sheet.textures[`${this._type}_idle_00.png`];
        const sprite = new Sprite(texture);
        sprite.scale.set(config.card.character.scale);
        this.addChild(sprite);
    }

    _createText() {
        const title = new Text({text: i18n.get('COST'), style: Styles.DEFAULT.TITLE});
        title.y = config.card.text.y;
        title.x = config.card.text.x;

        const value = new Text({text: '0', style: Styles.DEFAULT.VALUE});
        value.anchor.x = 1;
        value.x = this.width - config.card.text.x;
        value.y = config.card.text.y;
        this.addChild(title, value);
    }

    _addListeners() {
        this.on('pointerdown', () => {
            app.emit(Events.PLACE_DEFENDER, this._type);
        });
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
        this._type = '';
    }
}