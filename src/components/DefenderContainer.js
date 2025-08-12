import {Container} from 'pixi.js';
import Defender from './Defender';
import Events from '../constants/Events';

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

    _addListeners() {

    }

    spawnDefender(type = '', x = 0, y = 0) {
        const defender = new Defender(type);
        defender.spawn(x, y);
        this._defenders.push(defender);
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

        this._readyDefenders.push(defender);
        defender.activate();
        defender.buy();
        defender.on(Events.DEFENDER_COOLDOWN_START, this._removeDefenderReady, this);
        defender.on(Events.DEFENDER_COOLDOWN_COMPLETE, this._setDefenderReady, this);
    }

    _removeDefenderReady(defender) {
        this._readyDefenders.splice(this._readyDefenders.indexOf(defender), 1);
    }

    _setDefenderReady(defender) {
        this._readyDefenders.push(defender);
    }

    _destroyDefender(defender) {
        this._defenders.splice(this._defenders.indexOf(defender), 1);
        app.emit(Events.DESTROY_DEFENDER, defender);
        defender.destroy();
    }

    destroy(options = {}) {
        if (this.destroyed) return;

        this._defenders.forEach(defender => this._destroyDefender(defender));
        this._clear();
        this._removeListeners();
        this.removeFromParent();
        super.destroy({children: true});
    }

    _getLastDefender() {
        return this._defenders[this._defenders.length - 1];
    }

    _removeListeners() {

    }

    get readyDefenders() {
        return this._readyDefenders;
    }

    _clear() {
        this._defenders = null;
        this._readyDefenders = null;
    }
}