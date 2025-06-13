import State from '../core/State';
import {Assets, Sprite} from 'pixi.js';

export default class StartGame extends State {
    _createComponents() {
        this._createBackground();
    }

    _createBackground() {
        const back= new Sprite(Assets.get('back'));
        this.addChild(back);
    }
}
