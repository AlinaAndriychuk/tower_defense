import utils from '../helpers/utils';
import config from '../config';

export default class WaveController {
    constructor(enemyManager, waveConfig = {}, path = []) {
        this._enemyManager = enemyManager;
        this._waveConfig = waveConfig;
        this._path = waveConfig.path ?? path;

        this._isStopped = false;

        this._init();
    }

    _init() {
        this._spawnEnemies();
    }

    _spawnEnemies() {
        this._waveConfig.enemies.forEach( async ({ type, count }) => {
            for (let i = 0; i < count; i++) {
                if (this._isStopped) return;

                this._enemyManager.spawnEnemy(type, this._path);
                const enemyConfig = config.characters[type];
                await utils.wait(enemyConfig.delay);
            }
        });
    }

    _stop() {
        this._isStopped = true;
        this._clear();
    }

    _clear() {
        this._enemyManager = null;
        this._waveConfig = null;
        this._path = null;
    }
}