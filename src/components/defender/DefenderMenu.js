import {Container, Graphics, Text} from 'pixi.js';
import config from '../../config';
import i18n from '../../helpers/i18n';
import Styles from '../../constants/Styles';
import Button from '../Button';
import ButtonsConfig from '../../constants/ButtonsConfig';
import utils from '../../helpers/utils';
import Events from '../../constants/Events';

const defenderMenuButtonsConfig = [
    {
        text: i18n.get('SELL'),
        y: config.defenderMenu.sellButton.y,
        property: '_sellButton',
    },
    {
        text: i18n.get('CANCEL'),
        y: config.defenderMenu.cancelButton.y,
        property: '_cancelButton',
    },
];

const defenderMenuTextConfig = [
    {
        text: `${i18n.get('REFUND')}:`,
        x: config.defenderMenu.refund.x,
        y: config.defenderMenu.refund.y,
        property: '_refundText',
    },
];

export default class DefenderMenu extends Container {
    constructor(){
        super();
        this._defender = null;
        this._sellButton = null;
        this._cancelButton = null;
        this._refundText = null;

        this.interactive = true;
        this._init();
    }

    _init() {
        this._createComponents();
        this._addListeners();
        this._toggle();
    }

    _createComponents() {
        this._createBackground();
        defenderMenuButtonsConfig.forEach(componentData => this._createButton(componentData));
        defenderMenuTextConfig.forEach(componentData => this._createText(componentData));
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.defenderMenu.width, config.defenderMenu.height)
            .fill({ color: config.defenderMenu.color });
        graphics.alpha = config.defenderMenu.alpha;
        this.addChild(graphics);
    }

    _createButton({text = '', y = 0, property = ''}) {
        this[property] = new Button({
            ...ButtonsConfig.DEFAULT,
            text,
            style: Styles.DEFAULT.BUTTON
        });
        this[property].x = this.width / 2;
        this[property].y = y;
        this.addChild(this[property]);
    }

    _createText({text = '', x = 0, y = 0, property = ''}) {
        const title = new Text({text, style: Styles.DEFAULT.TITLE});
        title.x = x;
        title.y = y;

        this[property] = new Text({text: '', style: Styles.DEFAULT.VALUE});
        this[property].anchor.x = 1;
        this[property].x = this.width - x;
        this[property].y = y;
        this.addChild(title, this[property]);
    }

    _sellDefender() {
        if (!this._defender) return;

        app.emit(Events.SELL_DEFENDER, this._defender);
    }

    _toggle(defender) {
        if (defender) {
            this._defender = defender;
            this._updateValues();
        }
        this.visible = !this.visible;
    }

    _updateValues() {
        this._refundText.text = config.characters[this._defender.type].refund;
    }

    _showCancelButton() {
        this._hideAllComponents();
        this._cancelButton.visible = true;
    }

    _hideCancelButton() {
        this._showAllComponents();
        this._cancelButton.visible = false;
    }

    _cancelDefenderSpawn() {
        app.emit(Events.CANCEL_DEFENDER_SPAWN);
        this._hideCancelButton();
    }

    _showAllComponents() {
        this.children.forEach(child => child.visible = true);
    }

    _hideAllComponents() {
        this.children.forEach(child => {
            if (child instanceof Graphics) return;
            child.visible = false;
        });
    }

    _addListeners() {
        this._sellButton.on('pointerdown', this._sellDefender, this);
        this._cancelButton.on('pointerdown', this._cancelDefenderSpawn, this);
        app.on(Events.SPAWN_DEFENDER, this._showCancelButton, this);
        app.on(Events.BUY_DEFENDER, this._hideCancelButton, this);
        app.on(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
        this.on('pointerdown', event => {
            if (this._isPressedButton(event)) return;
            event.stopPropagation();
        }, this);
    }

    _removeListeners() {
        this.removeAllListeners();
        this.children.forEach(child => child.removeAllListeners());
        app.off(Events.SPAWN_DEFENDER, this._showCancelButton, this);
        app.off(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
    }

    _isPressedButton(event) {
        return this.children.some(child => child.isEnabled && child === event.target);
    }

    resize(width = 0, height = 0) {
        utils.positionTopRight(this, width, height);
        this.y += config.defenderMenu.y;
    }

    destroy() {
        this._clear();
        super.destroy({children: true});
    }

    _clear() {
        this._removeListeners();
        this._sellButton = null;
        this._cancelButton = null;
        this._refundText = null;
        this._defender = null;
    }
}