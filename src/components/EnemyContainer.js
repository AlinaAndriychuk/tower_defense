import {Container} from 'pixi.js';
import Enemy from './Enemy';
import Events from '../constants/Events';

export default class EnemyContainer extends Container{
    constructor() {
        super();
        this._enemies = [];

        this._init();
    }

    _init() {
        this._addListeners();
    }

    spawnEnemy(type = '', path = []) {
        const enemy = new Enemy(type);
        enemy.spawn(path[0].x, path[0].y);
        this._moveEnemy(enemy, path);
        this._enemies.push(enemy);
        this.addChildAt(enemy, 0);
    }

    _moveEnemy(enemy, path = [], currentStep = 0) {
        if (currentStep === path.length - 1) {
            return this._destroyEnemy(enemy);
        }

        currentStep++;
        if (!path[currentStep]) return;

        const {x = 0, y = 0, sort = ''} = path[currentStep];

        if (sort) {
            this._sortEnemy(enemy, sort);
        }

        enemy.move(x, y).then(() => this._moveEnemy(enemy, path, currentStep));
    }

    _sortEnemy(enemy, sort = '') {
        if (sort === 'backToFront') {
            const index = this._enemies.indexOf(enemy);
            this.addChildAt(enemy, index);
        } else if (sort === 'frontToBack') {
            this.addChildAt(enemy, 0);
        }
    }

    _destroyEnemy(enemy) {
        this._enemies.splice(this._enemies.indexOf(enemy), 1);
        enemy.destroy();
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._enemies.forEach(enemy => this._destroyEnemy(enemy));
        this._clear();
        this.removeFromParent();
        super.destroy({children: true});
    }

    get enemies() {
        return this._enemies;
    }

    _addListeners() {
        app.on(Events.ENEMY_KILLED, this._destroyEnemy, this);
    }

    _removeListeners() {
        app.off(Events.ENEMY_KILLED, this._destroyEnemy, this);
    }

    _clear() {
        this._removeListeners();
        this._enemies = null;
    }
}