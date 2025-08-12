import {Container, Graphics} from 'pixi.js';
import config from '../config';
import DefenderCard from './DefenderCard';
import Events from '../constants/Events';

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
            .rect(0, 0, config.card_container.width, config.card_container.height)
            .fill({ color: config.card_container.color });
        graphics.alpha = config.card_container.alpha;
        this.addChild(graphics);
    }

    _createCards() {
        config.defenders.forEach(type => {
            const card = new DefenderCard(type);
            this._cards.push(card);
            this.addChild(card);
        });
    }

    _addListeners() {
        app.on(Events.COINS_UPDATED, this._updateCardsState, this);
    }

    _updateCardsState(coins = 0) {
        this._cards.forEach(card => card.updateState(coins))
    }

    _removeListeners() {
        app.off(Events.COINS_UPDATED, this._updateCardsState, this);
    }

    resize(width = 0, height = 0) {
        this.x = Math.max((this.parent.width - width) / 2 / this.parent.scale.x, 0);
        this.y = Math.max((this.parent.height - height) / 2 / this.parent.scale.y, 0) + config.card_container.y;
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