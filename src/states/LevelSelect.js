import State from '../core/State';
import {Assets, Container, Sprite} from 'pixi.js';
import config from '../config';
import utils from '../helpers/utils';
import eventBus from '../core/EventBus';
import Events from '../constants/Events';
import States from '../constants/States';

export default class LevelSelect extends State {
    _createComponents() {
        this._createBackground();
        this._createLevelCards();
    }

    _createBackground() {
        const back= new Sprite(Assets.get('level_selector_back'));
        this.addChild(back);
    }

    _createLevelCards() {
        const container= new Container();
        utils.centralize(container, this.width, this.height);
        this.addChild(container);

        config.levelSelector.levels.forEach((level) => {
            const card= new Sprite(Assets.get(`level_selector_card_${level.id}`));
            utils.scaleToFit(card, config.levelSelector.card.width, config.levelSelector.card.height);
            card.anchor.set(0.5);
            card.eventMode = 'static';
            card.cursor = 'pointer';
            container.addChild(card);

            card.on('pointerdown', () => {
                eventBus.emit(Events.CHANGE_STATE, {name: States.LEVEL, data: level});
            });
        });
    }
}
