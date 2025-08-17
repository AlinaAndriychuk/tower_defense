import {Container, Graphics, Text} from 'pixi.js';
import config from '../../config';
import i18n from '../../helpers/i18n';
import Styles from '../../constants/Styles';
import Button from '../Button';
import ButtonsConfig from '../../constants/ButtonsConfig';
import utils from '../../helpers/utils';
import Events from '../../constants/Events';

const menuConfig = {
    width: 90,
    height: 272,
    padding: 5,
    y: 80,
    alpha: 0.3,
    color: 0x000000,
};

const Properties = {
    DAMAGE: 'damage',
    RANGE: 'range',
    DELAY: 'delay',
    SELL: 'sell',
    CANCEL: 'cancel',
}

const TextProperties = {
    COST: 'Cost',
    VALUE: 'Value',
}

const containerConfig = {
    margin: 71,
    textMargin: 2,
};

const buttonsConfig = [
    {
        text: i18n.get('UPGRADE_DAMAGE'),
        property: Properties.DAMAGE,
    },
    {
        text: i18n.get('UPGRADE_RANGE'),
        property: Properties.RANGE,
    },
    {
        text: i18n.get('UPGRADE_DELAY'),
        property: Properties.DELAY,
    },
    {
        text: i18n.get('SELL'),
        property: Properties.SELL,
    },
    {
        text: i18n.get('CANCEL'),
        property: Properties.CANCEL,
    },
];

const textConfig = [
    {
        text: `${i18n.get('COST')}:`,
        property: Properties.DAMAGE,
        textProperty: TextProperties.COST,
    },
    {
        text: `${i18n.get('DAMAGE')}:`,
        property: Properties.DAMAGE,
        textProperty: TextProperties.VALUE,
    },
    {
        text: `${i18n.get('COST')}:`,
        property: Properties.RANGE,
        textProperty: TextProperties.COST,
    },
    {
        text: `${i18n.get('RANGE')}:`,
        property: Properties.RANGE,
        textProperty: TextProperties.VALUE,
    },
    {
        text: `${i18n.get('COST')}:`,
        property: Properties.DELAY,
        textProperty: TextProperties.COST,
    },
    {
        text: `${i18n.get('DELAY')}:`,
        property: Properties.DELAY,
        textProperty: TextProperties.VALUE,
    },
    {
        text: `${i18n.get('REFUND')}:`,
        property: Properties.SELL,
        textProperty: TextProperties.VALUE,
    },
];

export default class DefenderMenu extends Container {
    constructor(){
        super();
        this._defender = null;

        this._damageContainer = null;
        this._rangeContainer = null;
        this._delayContainer = null;
        this._sellContainer = null;
        this._cancelContainer = null;

        this._damageButton = null;
        this._rangeButton = null;
        this._delayButton = null;
        this._sellButton = null;
        this._cancelButton = null;

        this._damageCost = null;
        this._rangeCost = null;
        this._delayCost = null;

        this._damageValue = null;
        this._rangeValue = null;
        this._delayValue = null;
        this._refundValue = null;

        this.interactive = true;
        this._init();
    }

    _init() {
        this._createComponents();
        this._setCancelButtonPosition();
        this._addListeners();
        this._toggle();
    }

    _createComponents() {
        this._createBackground();
        Object.values(Properties).forEach((property, index) => this._createContainer(property, index));
        buttonsConfig.forEach(componentData => this._createButton(componentData));
        textConfig.forEach(componentData => this._createText(componentData));
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, menuConfig.width, menuConfig.height)
            .fill({ color: menuConfig.color });
        graphics.alpha = menuConfig.alpha;
        this.addChild(graphics);
    }

    _createContainer(property = '', index = 0) {
        const container = new Container();
        container.y = containerConfig.margin * index + menuConfig.padding;
        this[`_${property}Container`] = container;
        this.addChild(container);
    }

    _createButton({text = '', property = ''}) {
        const button = new Button({
            ...ButtonsConfig.DEFAULT,
            text,
            style: Styles.DEFAULT.BUTTON
        });
        button.x = this.width / 2;
        button.pivot.y = 0;
        this[`_${property}Button`] = button;
        this[`_${property}Container`].addChild(button);
    }

    _createText({text = '', property = '', textProperty = ''}) {
        const container = this[`_${property}Container`];

        const title = new Text({text, style: Styles.DEFAULT.TITLE});
        title.x = menuConfig.padding;
        title.y = containerConfig.textMargin / container.children.length + container.height;

        const value = new Text({text: '', style: Styles.DEFAULT.VALUE});
        value.anchor.x = 1;
        value.x = this.width - menuConfig.padding;
        value.y = containerConfig.textMargin / container.children.length + container.height;
        this[`_${property + textProperty}`] = value;

        container.addChild(title, value);
    }

    _setCancelButtonPosition() {
        this._cancelContainer.y = menuConfig.height - menuConfig.padding - this._cancelContainer.height;
    }

    _sellDefender() {
        if (!this._defender) return;

        app.emit(Events.SELL_DEFENDER, this._defender);
    }

    _toggle(defender) {
        if (defender) {
            this._defender = defender;
            this._updateAllValues();
        }
        this.visible = !this.visible;
    }

    _updateAllValues() {
        this._updateValues(Properties.DAMAGE);
    }

    _upgradeDefenderDamage(event) {
        this._defender.damage = +this._damageValue.text;
        this._updateValues(Properties.DAMAGE);
        event.stopPropagation();
    }

    _updateValues(property = '') {
        const characterConfig = config.characters[this._defender.type];
        const level = characterConfig[property].indexOf(this._defender[property]);

        if (level === characterConfig[property].length - 1) {
            this._hideValueProperties(property);
            return;
        }

        const costProperty = this[`_${property + TextProperties.COST}`];
        const valueProperty = this[`_${property + TextProperties.VALUE}`];

        if (costProperty) costProperty.text = characterConfig.upgradeCost[level];
        if (valueProperty) valueProperty.text = characterConfig[property][level + 1];
    }

    _hideValueProperties(property = '') {
        this[`_${property}Container`].visible = false;
    }

    _showValueProperties(property = '') {
        this[`_${property}Container`].visible = true;
    }

    _showCancelButton() {
        this._hideAllComponents();
        this._showValueProperties(Properties.CANCEL);
    }

    _hideCancelButton() {
        this._showAllComponents();
        this._hideValueProperties(Properties.CANCEL);
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
        this._damageButton.on('pointerdown', this._upgradeDefenderDamage, this);

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
        return Object.values(Properties).some(property => {
            const button = this[`_${property}Button`];
            return button.isEnabled && button === event.target;
        });
    }

    resize(width = 0, height = 0) {
        utils.positionTopRight(this, width, height);
        this.y += menuConfig.y;
    }

    destroy() {
        this._clear();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _clear() {
        this._removeListeners();

        this._defender = null;

        this._damageContainer = null;
        this._rangeContainer = null;
        this._delayContainer = null;
        this._sellContainer = null;
        this._cancelContainer = null;

        this._damageButton = null;
        this._rangeButton = null;
        this._delayButton = null;
        this._sellButton = null;
        this._cancelButton = null;

        this._damageCost = null;
        this._rangeCost = null;
        this._delayCost = null;

        this._damageValue = null;
        this._rangeValue = null;
        this._delayValue = null;
        this._refundValue = null;
    }
}