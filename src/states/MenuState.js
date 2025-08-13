import {Text, Graphics, Sprite, Assets, Container} from 'pixi.js';
import State from '../core/State';
import Styles from '../constants/Styles';
import i18n from '../helpers/i18n';
import config from '../config';
import Events from '../constants/Events';
import States from '../constants/States';
import Button from '../components/Button';
import ButtonsConfig from '../constants/ButtonsConfig';

export default class MenuState extends State {
    constructor(name = '') {
        super(name);

        this._buttons = [];
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
        const button = new Button({
            ...ButtonsConfig.MENU,
            text: i18n.get('START_BUTTON'),
            style: Styles.MENU.BUTTON
        });
        button.x = this.width / 2;
        button.y = config.menu.button.y;
        this.addChild(button);
        this._buttons.push(button);

        button.once('pointerdown', () => {
            app.emit(Events.CHANGE_STATE, {name: States.LEVEL_SELECT});
        });
    }

    _clear() {
        super._clear();
        this._buttons = null;
    }
}
