import Character from '../Character';
import {FillGradient, Graphics} from 'pixi.js';
import config from '../../config';
import Events from '../../constants/Events';
import utils from '../../helpers/utils';
import AnimationNames from '../../constants/AnimationNames';

export default class Defender extends Character {
    _init() {
        super._init();
        this._lastAttackTime = performance.now();
    }

    _createCollision() {
        this._collision = new Graphics();

        const gradient = new FillGradient({
            type: 'radial',
            center: { x: 0.5, y: 0.5 },
            innerRadius: 0,
            outerCenter: { x: 0.5, y: 0.5 },
            outerRadius: 0.5,
            colorStops: [
                { offset: 0.1, color: 'rgba(0, 0, 0, 0)' },
                { offset: 1, color: config.defender.collision.default },
                { offset: 1, color: 'rgba(0, 0, 0, 0)' },
            ],
            textureSpace: 'local'
        });

        this._collision
            .ellipse(0, 0, this._characterConfig.collision.radiusX, this._characterConfig.collision.radiusY)
            .fill(gradient);

        this.addChild(this._collision);
    }

    showDisabled() {
        if (this._collision.tint === config.defender.collision.disabled) return;
        this._collision.tint = config.defender.collision.disabled;
    }

    showEnabled() {
        if (this._collision.tint === config.defender.collision.default) return;
        this._collision.tint = config.defender.collision.default;
    }

    activate() {
        this._collision.alpha = 0.2; // todo set to 0
        this._enable();
        this._animatedSprite.on('pointerdown', this._toggleDefenderMenu, this);
    }

    _toggleDefenderMenu(event) {
        event.stopPropagation();
        app.emit(Events.TOGGLE_DEFENDER_MENU, this);
    }

    _enable() {
        this._animatedSprite.eventMode = 'static';
        this._animatedSprite.cursor = 'pointer';
    }

    buy() {
        app.emit(Events.UPDATE_COINS, -this._characterConfig.buy);
    }

    sell() {
        this._hideAllComponents();
        return this._showCoins(this._characterConfig.refund).then(() => {
            app.emit(Events.UPDATE_COINS, this._characterConfig.refund);
        });
    }

    async attack(enemies = []) {
        const now = performance.now();

        if (now - this._lastAttackTime < this._characterConfig.attackCooldown * 1000) {
            this._startCooldown();
        } else {
            this._lastAttackTime = now;
            enemies[0].takeDamage(this._characterConfig.damage) // todo attack by selected target

            if (this._animationName !== this._getAnimation(AnimationNames.ATTACK)) {
                await this._playAnimation(AnimationNames.ATTACK);
                this._playAnimation(AnimationNames.IDLE);
            }
        }
    }

    _startCooldown() {
        app.emit(Events.DEFENDER_COOLDOWN_START, this);
        utils.wait(this._characterConfig.attackCooldown).then(() => {
            if (this.destroyed) return;
            app.emit(Events.DEFENDER_COOLDOWN_COMPLETE, this);
        });
    }

    _clear() {
        super._clear();
        this._lastAttackTime = null;
    }
}