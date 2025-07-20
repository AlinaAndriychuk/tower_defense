import {AnimatedSprite, Assets, Container} from 'pixi.js';
import config from '../config';
import Events from '../constants/Events';

export default class Enemy extends Container {
    constructor(type) {
        super();

        this._type = type;
        this._enemyConfig = config.enemies[type];
        this._animatedSprite = null;

        this._init();
    }

    _init() {
        this._createComponents();
        this.pivot.set(this.width / 2, this.height);
    }

    _createComponents() {
        const animationType = 'move';
        this._animatedSprite = new AnimatedSprite(this._getAnimation(animationType));
        this._animatedSprite.animationSpeed = 0.1;
        this._animatedSprite.play();
        this.addChild(this._animatedSprite);
    }

    _getAnimation(animationType = '') {
        const animationName = `${this._type}_${animationType}`;
        const sheet = Assets.cache.get(animationName);

        if (sheet.animations[animationName]) return sheet.animations[animationName];

        return sheet.animations[animationName] = Object.keys(sheet.textures)
            .filter(name => name.includes(`_${animationType}`))
            .sort()
            .map(name => sheet.textures[name]);
    }

    spawn(x, y) {
        this.position.set(x, y);
    }

    move(path = [], currentStep = 0) {
        currentStep++;

        if (this.destroyed || !path[currentStep]) return;

        const {x, y, sort} = path[currentStep];
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = distance / this._enemyConfig.speed;

        if (sort) {
            this.emit(Events.SORT_ENEMY, this, sort)
        }

        if (this.destroyed) return; // if it was removed between this function execution
        gsap.to(this, {
            x,
            y,
            duration,
            ease: 'none',
            onComplete: () => {
                this.move(path, currentStep); // todo check if enemy exist

                if (currentStep === path.length - 1) {
                    this.emit(Events.DESTROY_ENEMY, this)
                }
            }
        });
    }

    destroy(options= {}) {
        if (this.destroyed) return;

        this._clear();
        gsap.killTweensOf(this);
        this.removeFromParent();
        super.destroy({children: true});
    }

    _clear() {
        this._type = '';
        this._enemyConfig = null;
        this._animatedSprite = null;
    }
}