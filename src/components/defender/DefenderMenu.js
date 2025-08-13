import {Container, Graphics, Text} from 'pixi.js';
import config from '../../config';
import i18n from '../../helpers/i18n';
import Styles from '../../constants/Styles';
import Button from '../Button';
import ButtonsConfig from '../../constants/ButtonsConfig';
import utils from '../../helpers/utils';
import Events from '../../constants/Events';

export default class DefenderMenu extends Container {
    constructor(){
        super();
        this._defender = null;
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
        this._createCancelButton();
        this._createSellButton();
        this._createRefundText();
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.defenderMenu.width, config.defenderMenu.height)
            .fill({ color: config.defenderMenu.color });
        graphics.alpha = config.defenderMenu.alpha;
        this.addChild(graphics);
    }

    _createSellButton() { // todo create circle
        const button = new Button({
            ...ButtonsConfig.DEFAULT,
            text: i18n.get('SELL'),
            style: Styles.DEFAULT.BUTTON
        });
        button.x = this.width / 2;
        button.y = config.defenderMenu.sellButton.y;
        this.addChild(button);

        button.on('pointerdown', this._sellDefender, this)
    }

    _createRefundText() {
        const text = new Text({text: `${i18n.get('REFUND')}:`, style: Styles.DEFAULT.TITLE});
        text.x = config.defenderMenu.refund.x;
        text.y = config.defenderMenu.refund.y;

        this._refundText = new Text({text: '', style: Styles.DEFAULT.VALUE});
        this._refundText.anchor.x = 1;
        this._refundText.x = this.width - config.defenderMenu.refund.x;
        this._refundText.y = config.defenderMenu.refund.y;
        this.addChild(text, this._refundText);
    }

    _sellDefender() {
        if (!this._defender) return;

        app.emit(Events.SELL_DEFENDER, this._defender);
    }

    _isPressedButton(event) {
        return this.children.some(child => child.isEnabled && child === event.target);
    }

    _addListeners() {
        app.on(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
        this.on('pointerdown', event => {
            if (this._isPressedButton(event)) return;
            event.stopPropagation();
        }, this);
    }

    _removeListeners() {
        this.removeAllListeners();
        app.off(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
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
        this._defender = null;
    }
}