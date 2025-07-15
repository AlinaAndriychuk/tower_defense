import {AnimatedSprite, Assets, Container, Sprite} from 'pixi.js';
import config from '../config';
import utils from '../helpers/utils';

export default class Enemy extends Container {
    constructor(type) {
        super();

        this._type = type;
        this._enemyConfig = config.enemies[type];

        this._init();
    }

    _init() {
        console.log(this._type)
        this._createComponents();
    }

    _createComponents() {
        const animationType = 'move';
        const animationName = `${this._type}_${animationType}`;
        const sheet = Assets.cache.get(animationName); // todo move to other component or create static props not to repeat
        sheet.animations[animationName] = Object.keys(sheet.textures)
            .filter(name => name.includes(`_${animationType}`))
            .sort()
            .map(name => sheet.textures[name]);

        this._animatedSprite = new AnimatedSprite(sheet.animations[animationName]);
        this._animatedSprite.animationSpeed = 0.1;
        this._animatedSprite.play();
        this._animatedSprite.anchor.set(0.5, 1);
        this.addChild(this._animatedSprite);
    }

    spawn(x, y) {
        this._animatedSprite.position.set(x, y);
        app.currentState.addChild(this);


    }
}