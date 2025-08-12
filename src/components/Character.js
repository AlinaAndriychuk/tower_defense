import {AnimatedSprite, Assets, Container, Graphics} from 'pixi.js';
import config from '../config';
import AnimationNames from '../constants/AnimationNames';
import utils from '../helpers/utils';

export default class Character extends Container {
    constructor(type = '') {
        super();

        this._type = type;
        this._animatedSprite = null;
        this._collision = null;
        this._animationName = '';
        this._characterConfig = config.characters[this._type];
        this._destination = {x: 0, y: 0};

        this._init();
    }

    _init() {
        this._createAnimatedSprite(AnimationNames.IDLE);
        this._createCollision();
    }

    _createAnimatedSprite(animationType = '') {
        this._animationName = this._getAnimation(animationType);
        this._animatedSprite = new AnimatedSprite(this._animationName);
        this._animatedSprite.animationSpeed = this._characterConfig.animationSpeed;
        this._animatedSprite.pivot.set(this._animatedSprite.width / 2, this._animatedSprite.height / 2);
        this._animatedSprite.scale.set(config.characters.scale);
        this._animatedSprite.y = this._characterConfig.spriteY;
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

    _createCollision() {
        this._collision = new Graphics();
        this._collision
            .ellipse(0, 0, this._characterConfig.collision.radiusX, this._characterConfig.collision.radiusY)
            .fill();

        this._collision.alpha = 0.2; // todo change on 0
        this.addChild(this._collision);
    }

    spawn(x, y) {
        this.position.set(x, y);
        this._animatedSprite.play();
    }

    move(x= 0, y = 0) {
        if (this.destroyed || this._destination.x === x && this._destination.y === y) return;

        this._destination.x = x;
        this._destination.y = y;
        const duration = config.characters.speedCoefficient / this._characterConfig.speed;

        gsap.killTweensOf(this);
        return gsap.to(this, {
            x,
            y,
            duration,
            ease: 'none'
        }).then();
    }

    _rotate(x = 0) {
        if (this.x > x) {
            this._animatedSprite.scale.x = -Math.abs(this._animatedSprite.scale.x);
        } else if (this.x < x) {
            this._animatedSprite.scale.x = Math.abs(this._animatedSprite.scale.x);
        }
    }

    _playAnimation(animationType, loop = false) {
        this._animationName = this._getAnimation(animationType);
        this._animatedSprite.textures = this._animationName;
        this._animatedSprite.loop = loop;
        this._animatedSprite.gotoAndPlay(0);

        const deferred = utils.deferred();
        this._animatedSprite.onComplete = () => {
            deferred.resolve();
        };
        return deferred.promise;
    }

    destroy(options= {}) {
        if (this.destroyed) return;

        this._clear();
        gsap.killTweensOf(this);
        this.removeAllListeners();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _clear() {
        this._type = null;
        this._animatedSprite = null;
        this._characterConfig = null;
        this._destination = null;
        this._collision = null;
        this._animationName = null;
    }

    get radiusX() {
        return this._collision.width / 2;
    }

    get radiusY() {
        return this._collision.height / 2;
    }
}