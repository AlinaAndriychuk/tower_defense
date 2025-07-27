import {Container} from 'pixi.js';
import Defender from './Defender';

export default class DefenderContainer extends Container{
    constructor() {
        super();
        this._defenders = [];

        this._init();
    }

    _init() {
        this._addListeners();
    }

    _addListeners() {

    }

    spawnDefender(type = '', x = 0, y = 0) {
        const defender = new Defender(type);
        defender.spawn(x, y);
        this._defenders.push(defender);
        return this.addChild(defender);
    }

    moveDefender(x = 0, y = 0) {
        const lastSpawnedDefender = this._defenders[this._defenders.length - 1];
        if (!lastSpawnedDefender) {
            return;
        }
        lastSpawnedDefender.move(x, y);
    }

    _destroyDefender(defender) {
        this._defenders.splice(this._defenders.indexOf(defender), 1);
        defender.destroy();
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._defenders.forEach(defender => this._destroyDefender(defender));
        this._removeListeners();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _removeListeners() {

    }
}