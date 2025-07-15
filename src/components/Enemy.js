import {AnimatedSprite, Assets, Container} from 'pixi.js';
import config from '../config';
import gsap from 'gsap';

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
        this.addChild(this._animatedSprite);

        this.pivot.set(this.width / 2, this.height);
    }

    spawn(x, y) {
        this.position.set(x, y);
        app.currentState.addChild(this);
    }

    move(path = [], currentStep = 0) {
        currentStep++;
        console.log(path[currentStep]);
        if (!path[currentStep]) return;

        const {x, y} = path[currentStep];
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = distance / this._enemyConfig.speed;

        gsap.to(this, {
            x,
            y,
            duration,
            ease: 'none',
            onComplete: () => {
                this.move(path, currentStep);
            }
        })
    }
}