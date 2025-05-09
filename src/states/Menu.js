import {Text, Graphics, Sprite, Assets} from 'pixi.js';
import State from './State';
import Styles from '../constants/Styles';
import i18n from '../core/i18n';
import config from '../config';

export default class Menu extends State {
    constructor() {
        super();
        this._startButton = null;
        this._back = null;
    }

    _createComponents() {
        this._createBackground();
        this._createTitle();
        this._createStartButton();
    }

    _createBackground() {
        this._back = new Sprite(Assets.get('back'));
        this.addChild(this._back);
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
        this._startButton = new Graphics()
            .rect(0, 0, config.menu.startButton.width, config.menu.startButton.height)
            .fill({ color: config.menu.startButton.color });
        this._startButton.pivot.set(this._startButton.width / 2, this._startButton.height / 2);
        this._startButton.x = this.width / 2;
        this._startButton.y = config.menu.startButton.y;
        this._startButton.eventMode = 'static';
        this._startButton.cursor = 'pointer';
        this.addChild(this._startButton);

        const text = new Text({
            text: i18n.get('START_BUTTON'),
            style: Styles.MENU.BUTTON
        });
        text.anchor.set(0.5);
        text.x = this._startButton.width / 2;
        text.y =  this._startButton.height / 2;
        this._startButton.addChild(text);
    }

    _addListeners() {
        super._addListeners();
        this._startButton.on('pointerdown', () => {
            console.log('start game')
        });
    }
}
