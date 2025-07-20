import {Container, Assets, EventEmitter, autoDetectRenderer, Ticker} from 'pixi.js';
import i18n from '../helpers/i18n';
import config from '../config';
import manifest from '../manifest';
import Events from '../constants/Events';
import StateMachine from './StateMachine';

export default class App extends EventEmitter {
    constructor() {
        super();

        this._renderer = null;
        this._stage = null;
        this._ticker = Ticker.shared;
    }

    async start(states = {}) {
        i18n.setLang(config.lang);
        await this._createRenderer();
        this._createStage();
        await this._loadAssets();
        this._createStateMachine(states);

        this._addListeners();
        this._resize();
    }

    async _createRenderer() {
        this._renderer = await autoDetectRenderer(config.renderer);
        document.getElementById('game-container').appendChild(this._renderer.canvas);
    }

    _createStage() {
        this._stage = new Container();

        this._ticker.add(() => {
            this._renderer.render(this._stage);
        });
    }

    async _loadAssets() {
        await Assets.init({ manifest });
        const bundleNames = manifest.bundles.map(b => b.name);

        for (const name of bundleNames) {
            await Assets.loadBundle(name);
        }
    }

    _createStateMachine(states = {}) {
        const stateMachine = new StateMachine();
        Object.keys(states).forEach((name) => {
            stateMachine.addState(name, states[name]);
        });
        app.emit(Events.CHANGE_STATE, {name: config.entryState});
    }

    _addListeners() {
        window.addEventListener('resize', () => this._resize());
    }

    _resize() {
        this._renderer.resize(window.innerWidth, window.innerHeight);
        app.emit(Events.RESIZE, this.width, this.height);
    }

    get ticker() {
        return this._ticker;
    }

    get width() {
        return this._renderer.width;
    }

    get height() {
        return this._renderer.height;
    }

    get stage() {
        return this._stage;
    }
}