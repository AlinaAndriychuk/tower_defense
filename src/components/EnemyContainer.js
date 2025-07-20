import {Container} from 'pixi.js';
import Enemy from './Enemy';
import Events from '../constants/Events';

export default class EnemyContainer extends Container{
    constructor() {
        super();
        this._enemies = [];
    }

    spawnEnemy(type = '', path = []) {
        const enemy = new Enemy(type);
        enemy.spawn(path[0].x, path[0].y);
        enemy.move(path);

        enemy.on(Events.SORT_ENEMY, this._sortEnemy, this);
        enemy.on(Events.DESTROY_ENEMY, this._destroyEnemy, this);

        this._enemies.push(enemy);
        this.addChildAt(enemy, 0);
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
        enemy.removeAllListeners();
        enemy.destroy();
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._enemies.forEach(enemy => this._destroyEnemy(enemy));
        this.removeFromParent();
        super.destroy({children: true});
    }
}