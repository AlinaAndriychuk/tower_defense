import Character from './Character';
import AnimationNames from '../constants/AnimationNames';
import {Container, Graphics, Text} from 'pixi.js';
import config from '../config';
import Styles from '../constants/Styles';
import Events from '../constants/Events';
import i18n from '../helpers/i18n';

export default class Enemy extends Character {
    _init() {
        super._init();
        this._createHealthBar();

        this._health = this._characterConfig.health;
    }

    _createHealthBar() {
        const container = new Container();

        const border = new Graphics() // todo change on sprite cause of jitter
            .rect(0, 0, config.enemy.healthBar.width, config.enemy.healthBar.height)
            .stroke(Styles.ENEMY.HEALTH_BAR.BORDER);

        const emptyBar = new Graphics()
            .rect(0, 0, config.enemy.healthBar.width, config.enemy.healthBar.height)
            .fill(Styles.ENEMY.HEALTH_BAR.EMPTY);

        this._healthIndictor = new Graphics()
            .rect(0, 0, config.enemy.healthBar.width, config.enemy.healthBar.height)
            .fill(Styles.ENEMY.HEALTH_BAR.FULL);

        container.addChild(border, emptyBar, this._healthIndictor);
        container.pivot.set(container.width / 2, container.height / 2);
        container.y = config.enemy.healthBar.y;
        this.addChild(container);
    }

    move(x= 0, y = 0) {
        if (this.destroyed) return;

        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = distance / this._characterConfig.speed;

        this._rotate(x);

        if (this.destroyed) return; // if it was removed between this function execution
        gsap.killTweensOf(this);
        return gsap.to(this, {
            x,
            y,
            duration,
            ease: 'none'
        }).then();
    }

    _createAnimatedSprite(animationType = '') {
        super._createAnimatedSprite(AnimationNames.MOVE);
    }

    takeDamage(damage = 0) {
        if (this._isKilled()) return;

        if (this._health - damage <= 0) {
            this._kill();
            return;
        }

        this._setHealth(this._health - damage);
    }

    _setHealth(value = 0) {
        this._health = value;
        this._healthIndictor.scale.x = this._health / this._characterConfig.health;
    }

    _kill() {
        this._setHealth(0);
        gsap.killTweensOf(this);
        app.emit(Events.UPDATE_COINS, this._characterConfig.coins);
        this._hideAllElements();
        this._showCoins();
    }

    _hideAllElements() {
        this.children.forEach(child => child.visible = false);
    }

    _isKilled() {
        return this._health === 0;
    }

    _showCoins() {
        const text = new Text({
            text: `+${this._characterConfig.coins} ${i18n.get('COINS')}`,
            style: Styles.ENEMY.COINS
        });
        text.anchor.set(0.5);
        this.addChild(text);

        gsap.to(text, {
            y: config.enemy.coins.y,
            duration: config.enemy.coins.duration,
            onComplete: () => {
                this.emit(Events.ENEMY_KILLED, this);
            }
        })
    }
}