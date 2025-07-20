import Events from '../constants/Events';

export default class PlayerStats {
    constructor(coins = 0, lives = 0) {
        this._coins = coins;
        this._lives = lives;

        this._init();
    }

    _init() {
        this._addListeners();
        this._updateCoins();
        this._updateLives();
    }

    _addListeners() {
        app.on(Events.UPDATE_COINS, this._updateCoins, this);
        app.on(Events.UPDATE_LIVES, this._updateLives, this);
    }

    _removeListeners() {
        app.off(Events.UPDATE_COINS, this._updateCoins, this);
        app.off(Events.UPDATE_LIVES, this._updateLives, this);
    }

    _updateCoins(coins = 0) {
        this._coins += coins;
        app.emit(Events.UPDATE_STATS, {coins: this._coins});
    }

    _updateLives(lives = 0) {
        this._lives += lives;
        app.emit(Events.UPDATE_STATS, {lives: this._lives});
    }

    clear() {
        this._removeListeners();
        this._coins = 0;
        this._lives = 0;
    }
}