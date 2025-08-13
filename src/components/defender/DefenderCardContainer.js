import {Container, Graphics} from 'pixi.js';
import config from '../../config';
import DefenderCard from './DefenderCard';
import Events from '../../constants/Events';
import utils from '../../helpers/utils';

export default class DefenderCardContainer extends Container {
    constructor(){
        super();

        this._cards = [];
        this._init();
    }

    _init() {
        this._createComponents();
        this._addListeners();
    }

    _createComponents() {
        this._createBackground();
        this._createCards();
    }

    _createBackground() {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, config.cardContainer.width, config.cardContainer.height)
            .fill({ color: config.cardContainer.color });
        graphics.alpha = config.cardContainer.alpha;
        this.addChild(graphics);
    }

    _createCards() {
        config.defenders.forEach(type => {
            const card = new DefenderCard(type);
            this._cards.push(card);
            this.addChild(card);
        });
    }

    _updateCardsState(coins = 0) {
        this._cards.forEach(card => card.updateState(coins));
    }

    _toggle() {
        this.visible = !this.visible;
    }

    _addListeners() {
        app.on(Events.COINS_UPDATED, this._updateCardsState, this);
        app.on(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
    }

    _removeListeners() {
        app.off(Events.COINS_UPDATED, this._updateCardsState, this);
        app.off(Events.TOGGLE_DEFENDER_MENU, this._toggle, this);
    }

    resize(width = 0, height = 0) {
        utils.positionTopRight(this, width, height);
        this.y += config.cardContainer.y;
    }

    destroy() {
        this._clear();
        super.destroy({children: true});
    }

    _clear() {
        this._removeListeners();
        this._cards = null;
    }
}