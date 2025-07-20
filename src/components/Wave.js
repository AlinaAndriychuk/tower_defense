import Enemy from './Enemy';
import utils from '../helpers/utils';
import config from '../config';

export default class Wave {
    constructor(enemyManager, waveConfig = {}, path = []) {
        this._enemyManager = enemyManager;
        this._waveConfig = waveConfig;
        this._path = waveConfig.path ?? path;

        this._init();
    }

    _init() {
        this._spawnEnemies();
    }

    _spawnEnemies() {
        this._waveConfig.enemies.forEach( async ({ type, count }) => {
            for (let i = 0; i < count; i++) {
                this._enemyManager.spawnEnemy(type, this._path);

                const enemyConfig = config.enemies[type];
                await utils.wait(enemyConfig.delay);
            }
        });
    }

    _clear() {
        this._enemyManager = null;
        this._waveConfig = null;
        this._path = [];
    }
}