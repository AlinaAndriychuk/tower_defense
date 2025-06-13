import {Text, Graphics, Sprite, Assets, Container} from 'pixi.js';
import State from '../core/State';
import Styles from '../constants/Styles';
import i18n from '../helpers/i18n';
import config from '../config';
import eventBus from '../core/EventBus';
import Events from '../constants/Events';
import States from '../constants/States';

export default class Menu extends State {
    constructor(name) {
        super(name);
    }

    _createComponents() {
        this._createBackground();
        this._createTitle();
        this._createStartButton();
    }

    _createBackground() {
        const back= new Sprite(Assets.get('back'));
        this.addChild(back);
    }

    _createTitle() {
        const title = new Text({
            text: i18n.get('GAME_NAME'),
            style: Styles.MENU.TITLE
        });
        title.anchor.set(0.5);
        title.x = this.width / 2;
        title.y = config.menu.title.y;
        this.addChild(title);
    }

    _createStartButton() {
        const startButton = new Container();
        const graphics = new Graphics()
            .rect(0, 0, config.menu.startButton.width, config.menu.startButton.height)
            .fill({ color: config.menu.startButton.color });
        startButton.addChild(graphics);
        startButton.pivot.set(startButton.width / 2, startButton.height / 2);
        startButton.x = this.width / 2;
        startButton.y = config.menu.startButton.y;
        startButton.eventMode = 'static';
        startButton.cursor = 'pointer';
        this.addChild(startButton);

        const text = new Text({
            text: i18n.get('START_BUTTON'),
            style: Styles.MENU.BUTTON
        });
        text.anchor.set(0.5);
        text.x = startButton.width / 2;
        text.y =  startButton.height / 2;
        startButton.addChild(text);

        startButton.on('pointerdown', () => {
            eventBus.emit(Events.CHANGE_STATE, States.LEVELS);
        });
    }
}
