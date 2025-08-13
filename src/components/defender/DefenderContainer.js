import {Container} from 'pixi.js';
import Defender from './Defender';
import Events from '../../constants/Events';

export default class DefenderContainer extends Container{
    constructor() {
        super();
        this._defenders = [];
        this._readyDefenders = [];

        this._init();
    }

    _init() {
        this._addListeners();
    }

    spawnDefender(type = '', x = 0, y = 0) {
        const defender = new Defender(type);
        defender.spawn(x, y);
        this._defenders.push(defender);
        app.emit(Events.TOGGLE_DEFENDER_MENU, defender);
        return this.addChild(defender);
    }

    moveDefender(x = 0, y = 0) {
        this._getLastDefender()?.move(x, y);
    }

    showDefenderDisabled() {
        this._getLastDefender()?.showDisabled();
    }

    showDefenderEnabled() {
        this._getLastDefender()?.showEnabled();
    }

    buyDefender() {
        const defender = this._getLastDefender();
        if (!defender) return;

        this._setDefenderReady(defender);
        defender.activate();
        defender.buy();
    }

    cancelDefenderSpawn() {
        const defender = this._getLastDefender();
        if (!defender) return;

        this._destroyDefender(defender);
    }

    _removeDefenderReady(defender) {
        if (!this._readyDefenders.includes(defender)) return;
        const index = this._readyDefenders.indexOf(defender);
        this._readyDefenders.splice(index, 1);
    }

    _setDefenderReady(defender) {
        this._readyDefenders.push(defender);
    }

    _sellDefender(defender) {
        defender.sell().then(() => this._destroyDefender(defender));
    }

    _destroyDefender(defender) {
        this._removeDefenderReady(defender);
        this._defenders.splice(this._defenders.indexOf(defender), 1);
        app.emit(Events.DESTROY_DEFENDER, defender);
        defender.destroy();
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._defenders.forEach(defender => this._destroyDefender(defender));
        this._clear();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _getLastDefender() {
        return this._defenders[this._defenders.length - 1];
    }

    _addListeners() {
        app.on(Events.DEFENDER_COOLDOWN_START, this._removeDefenderReady, this);
        app.on(Events.DEFENDER_COOLDOWN_COMPLETE, this._setDefenderReady, this);
        app.on(Events.SELL_DEFENDER, this._sellDefender, this);
    }

    _removeListeners() {
        app.off(Events.DEFENDER_COOLDOWN_START, this._removeDefenderReady, this);
        app.off(Events.DEFENDER_COOLDOWN_COMPLETE, this._setDefenderReady, this);
        app.off(Events.SELL_DEFENDER, this._sellDefender, this);
    }

    _clear() {
        this._removeListeners();
        this._defenders = null;
        this._readyDefenders = null;
    }

    get readyDefenders() {
        return this._readyDefenders;
    }
}