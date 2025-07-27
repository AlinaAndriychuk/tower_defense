import {AnimatedSprite, Assets, Container} from 'pixi.js';
import config from '../config';

export default class Character extends Container {
    constructor(type = '') {
        super();

        this._type = type;
        this._animatedSprite = null;
        this._characterConfig = config.characters[this._type];

        this._init();
    }

    _init() {
        this._createAnimatedSprite('idle');
        this.pivot.set(this.width / 2, this.height);
    }

    _createAnimatedSprite(animationType = '') {
        this._animatedSprite = new AnimatedSprite(this._getAnimation(animationType));
        this._animatedSprite.animationSpeed = this._characterConfig.animationSpeed;
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
        this._animatedSprite.play();
    }

    move(x= 0, y = 0) {
        if (this.destroyed) return;

        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = distance / this._characterConfig.speed;

        this._rotate(x);

        if (this.destroyed) return; // if it was removed between this function execution

        if (this._type === 'ariel') {
            console.log(x, y)
        }
        return gsap.to(this, {
            x,
            y,
            duration,
            ease: 'none'
        }).then();
    }

    _rotate(x = 0) {
        if (this.x > x) {
            this.scale.x = -1;
        } else if (this.x < x) {
            this.scale.x = 1;
        }
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
        this._animatedSprite = null;
        this._characterConfig = null;
    }
}