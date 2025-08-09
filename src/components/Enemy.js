import Character from './Character';
import config from '../config';

export default class Enemy extends Character {
    _init() {
        super._init();
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
        super._createAnimatedSprite('move');
    }
}