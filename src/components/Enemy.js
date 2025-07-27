import Character from './Character';

export default class Enemy extends Character {
    _init() {
        super._init();
    }

    _createAnimatedSprite(animationType = '') {
        super._createAnimatedSprite('move');
    }
}