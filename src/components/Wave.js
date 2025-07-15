import Enemy from './Enemy';

export default class Wave {
    constructor(waveConfig, path) {
        this._waveConfig = waveConfig;
        this._path = path;
        this._enemyCounter = 0;

        this._init();
    }

    _init() {
        this._spawnEnemies();
    }

    _spawnEnemies() {
        this._waveConfig.enemies.forEach(({ type, count }) => {
            for (let i = 0; i < count; i++) {
                const enemy = new Enemy(type);
                enemy.spawn(this._path[0].x, this._path[0].y);
                enemy.move(this._path);
            }
        });
    }
}