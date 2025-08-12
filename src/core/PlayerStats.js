import Events from '../constants/Events';

export default class PlayerStats {
    constructor() {
        this._coins = 0;
        this._lives = 0;

        this._init();
    }

    _init() {
        this._addListeners();
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
        app.emit(Events.COINS_UPDATED, this._coins);
    }

    _updateLives(lives = 0) {
        this._lives += lives;
        app.emit(Events.LIVES_UPDATED, this._lives);
    }

    clear() {
        this._removeListeners();
        this._coins = 0;
        this._lives = 0;
    }
}